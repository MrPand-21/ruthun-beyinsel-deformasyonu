import { fail, redirect } from "@sveltejs/kit";
import { EmailVerificationService } from "$lib/server/db/models/email.verification.model";
import { PasswordResetSessionService } from "$lib/server/db/models/password.reset.session.model";
import { UserService } from "$lib/server/db/models/user.model";
import { ExpiringTokenBucket } from "$lib/server/utils/rate-limit";
import { ObjectId } from "mongodb";

import type { Actions, PageServerLoad } from "./$types";

export const load = async (event) => {
    if (event.locals.user === null) {
        return redirect(302, "/login");
    }

    let verificationRequest = await EmailVerificationService.getUserEmailVerificationRequestFromRequest(event);

    if (verificationRequest === null || new Date() >= verificationRequest.expirationDate) {
        if (event.locals.user.emailVerified) {
            return redirect(302, "/");
        }

        verificationRequest = await EmailVerificationService.createEmailVerificationRequest(
            event.locals.user._id,
            event.locals.user.email
        );

        EmailVerificationService.sendVerificationEmail(verificationRequest.email, verificationRequest.code);
        EmailVerificationService.setEmailVerificationRequestCookie(event, verificationRequest);
    }

    return {
        email: verificationRequest.email
    };
};

const bucket = new ExpiringTokenBucket<string>(5, 60 * 30);

export const actions: Actions = {
    verify: async (event) => {
        if (event.locals.session === null || event.locals.user === null) {
            return fail(401, {
                verify: {
                    message: "Not authenticated"
                }
            });
        }

        if (event.locals.user.registered2FA && !event.locals.session.twoFactorVerified) {
            return fail(403, {
                verify: {
                    message: "Forbidden"
                }
            });
        }

        // Rate limiting check
        const userId = event.locals.user._id.toString();
        if (!bucket.check(userId, 1)) {
            return fail(429, {
                verify: {
                    message: "Too many requests"
                }
            });
        }

        let verificationRequest = await EmailVerificationService.getUserEmailVerificationRequestFromRequest(event);
        if (verificationRequest === null) {
            return fail(401, {
                verify: {
                    message: "Not authenticated"
                }
            });
        }

        const formData = await event.request.formData();
        const code = formData.get("code");

        if (typeof code !== "string") {
            return fail(400, {
                verify: {
                    message: "Invalid or missing fields"
                }
            });
        }

        if (code === "") {
            return fail(400, {
                verify: {
                    message: "Enter your code"
                }
            });
        }

        if (!bucket.consume(userId, 1)) {
            return fail(429, {
                verify: {
                    message: "Too many requests"
                }
            });
        }

        if (new Date() >= verificationRequest.expirationDate) {
            verificationRequest = await EmailVerificationService.createEmailVerificationRequest(
                verificationRequest.userId,
                verificationRequest.email
            );

            EmailVerificationService.sendVerificationEmail(verificationRequest.email, verificationRequest.code);
            EmailVerificationService.setEmailVerificationRequestCookie(event, verificationRequest);

            return {
                verify: {
                    message: "The verification code was expired. We sent another code to your inbox."
                }
            };
        }

        if (verificationRequest.code !== code) {
            return fail(400, {
                verify: {
                    message: "Incorrect code."
                }
            });
        }

        await EmailVerificationService.deleteUserEmailVerificationRequests(event.locals.user._id);
        await PasswordResetSessionService.invalidateUserPasswordResetSessions(event.locals.user._id);

        await UserService.update(event.locals.user._id, {
            email: verificationRequest.email,
            emailVerified: true
        });

        EmailVerificationService.deleteEmailVerificationRequestCookie(event);

        // if (!event.locals.user.registered2FA) {
        //     return redirect(302, "/2fa/setup");
        // }

        return redirect(302, "/");
    },

    resend: async (event) => {
        if (event.locals.session === null || event.locals.user === null) {
            return fail(401, {
                resend: {
                    message: "Not authenticated"
                }
            });
        }

        if (event.locals.user.registered2FA && !event.locals.session.twoFactorVerified) {
            return fail(403, {
                resend: {
                    message: "Forbidden"
                }
            });
        }

        const userId = event.locals.user._id.toString();
        if (!EmailVerificationService.sendVerificationEmailBucket.check(userId, 1)) {
            return fail(429, {
                resend: {
                    message: "Too many requests"
                }
            });
        }

        let verificationRequest = await EmailVerificationService.getUserEmailVerificationRequestFromRequest(event);

        if (verificationRequest === null) {
            if (event.locals.user.emailVerified) {
                return fail(403, {
                    resend: {
                        message: "Forbidden"
                    }
                });
            }

            if (!EmailVerificationService.sendVerificationEmailBucket.consume(userId, 1)) {
                return fail(429, {
                    resend: {
                        message: "Too many requests"
                    }
                });
            }

            verificationRequest = await EmailVerificationService.createEmailVerificationRequest(
                event.locals.user._id,
                event.locals.user.email
            );
        } else {
            if (!EmailVerificationService.sendVerificationEmailBucket.consume(userId, 1)) {
                return fail(429, {
                    resend: {
                        message: "Too many requests"
                    }
                });
            }

            verificationRequest = await EmailVerificationService.createEmailVerificationRequest(
                event.locals.user._id,
                verificationRequest.email
            );
        }

        EmailVerificationService.sendVerificationEmail(verificationRequest.email, verificationRequest.code);
        EmailVerificationService.setEmailVerificationRequestCookie(event, verificationRequest);

        return {
            resend: {
                message: "A new code was sent to your inbox."
            }
        };
    }
};