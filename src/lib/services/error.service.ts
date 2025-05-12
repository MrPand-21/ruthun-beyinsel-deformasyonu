import type { ErrorResponseType } from "$lib/types";

export const getEmptyErrorResponse = (message: string): ErrorResponseType => ({
  message,
  code: "UNKNOWN_ERROR",
  errors: {},
});

export const isValidationError = (error: ErrorResponseType): boolean => {
  return !!error.errors && Object.keys(error.errors).length > 0;
};

export const getFirstValidationError = (error: ErrorResponseType): string => {
  if (!error.errors) return error.message;

  const firstError = Object.values(error.errors)[0];
  return firstError ? firstError[0] : error.message;
};
