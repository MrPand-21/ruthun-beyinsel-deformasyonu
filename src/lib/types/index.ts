export interface ErrorResponseType {
    message: string;
    code?: string;
    errors?: Record<string, string[]>;
}

export interface AnalyticsDto {
    browserHash: string;
    landingPage: string;
    isIncognitoMode: boolean;
    userAgent: string;
    referralSiteUrl?: string;
}

export interface Activity {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    date?: string;
    participants?: number;
    location?: string;
    tags?: string[];
}

export interface Course {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    instructor?: string;
    duration?: string;
    level?: 'Beginner' | 'Intermediate' | 'Advanced';
}