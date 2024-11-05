"use client";

import { useChat } from "ai/react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useVercelUseChatRuntime } from "@assistant-ui/react-ai-sdk";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../alert-dialog";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "../button";
import { Lock, LogIn, UserPlus, AlertCircle, XCircle, Timer, ExternalLink, LockIcon } from "lucide-react";
import { CountdownTimer } from "./countdownTimer";
import { SignInButton, SignUpButton } from '@clerk/nextjs'
interface ErrorResponse {
    error: string;
    code: string;
    status: number;
}
interface APIErrorResponse {
    error: string;
    code: string;
    status: number;
}
const AuthErrorDialog = ({ error }: { error: APIErrorResponse }) => {
    const [open, setOpen] = useState(true);
    const router = useRouter();

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="bg-background border border-border sm:max-w-[425px]">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground flex items-center gap-2">
                        <LockIcon className="h-5 w-5 text-destructive" />
                        Authentication Required
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                        <div className="space-y-2">
                            <p>{error.error}</p>
                            <p className="text-sm">
                                Please sign in or create an account to use our AI features.
                            </p>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:space-x-2">
                    <AlertDialogCancel
                        className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        <SignUpButton>
                            sign up
                        </SignUpButton>
                    </AlertDialogAction>
                    <Button
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"

                    >
                        <SignInButton>
                            sign in
                        </SignInButton>

                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
export function MyRuntimeProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const chat = useChat({
        api: "/api/chat",
        // onError: (error) => {
        //     try {
        //         // Try to parse error message as JSON
        //         const errorData: ErrorResponse = JSON.parse(error.message);

        //         // Show different toast styles based on error type
        //         switch (errorData.code) {
        //             case 'RATE_LIMIT_EXCEEDED':
        //                 toast.error('Rate limit exceeded. Please wait a moment.', {
        //                     description: 'Try again in 60 seconds',
        //                     duration: 5000,
        //                 });
        //                 break;

        //             case 'TOKEN_LIMIT_EXCEEDED':
        //                 toast.warning('Message too long', {
        //                     description: 'Please reduce your message length and try again',
        //                     duration: 4000,
        //                 });
        //                 break;

        //             case 'API_KEY_MISSING':
        //                 toast.error('Configuration Error', {
        //                     description: 'API key is missing. Please contact support.',
        //                     duration: 5000,
        //                 });
        //                 break;

        //             case 'VALIDATION_ERROR':
        //                 toast.error('Invalid Input', {
        //                     description: errorData.error,
        //                     duration: 4000,
        //                 });
        //                 break;

        //             case 'NETWORK_ERROR':
        //                 toast.error('Network Error', {
        //                     description: 'Please check your connection and try again',
        //                     duration: 4000,
        //                 });
        //                 break;

        //             default:
        //                 toast.error('An error occurred', {
        //                     description: errorData.error || 'Please try again later',
        //                     duration: 4000,
        //                 });
        //         }
        //     } catch {
        //         // If error is not JSON, show generic error toast
        //         toast.error('Something went wrong', {
        //             description: error.message,
        //             duration: 4000,
        //         });
        //     }
        // },
        onError: (error: Error) => {
            try {
                const errorResponse: APIErrorResponse = JSON.parse(error.message);
                if (errorResponse.code === "AUTHENTICATION_REQUIRED") {
                    return <AuthErrorDialog error={errorResponse} />;
                }
                if (errorResponse.code === "RATE_LIMIT_EXCEEDED") {
                    toast.error('Rate Limit Exceeded', {
                        description: (
                            <div className="flex flex-col space-y-3">
                                <div className="text-sm text-destructive">
                                    {errorResponse.error}
                                </div>
                                <CountdownTimer seconds={30} />
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Meanwhile, try:</span>
                                    <Button
                                        variant="link"
                                        className="h-auto p-0 text-primary inline-flex items-center gap-1"
                                        onClick={() => window.open('https://chat.openai.com', '_blank')}
                                    >
                                        ChatGPT
                                        <ExternalLink className="h-3 w-3" />
                                    </Button>
                                    <span>or</span>
                                    <Button
                                        variant="link"
                                        className="h-auto p-0 text-primary inline-flex items-center gap-1"
                                        onClick={() => window.open('https://www.perplexity.ai', '_blank')}
                                    >
                                        Perplexity
                                        <ExternalLink className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        ),
                        duration: 31000, // Slightly longer than countdown
                        className: "bg-background border border-border rounded-[var(--radius)] p-4 shadow-lg",
                    });
                    return;
                }

                toast.error('Error Details', {
                    description: (
                        <div className="flex flex-col space-y-2 font-medium">
                            <div className="flex flex-col space-y-1.5 text-sm">
                                <div className="flex items-start">
                                    <span className="text-muted-foreground min-w-[4.5rem]">Message:</span>
                                    <span className="text-destructive ml-2">
                                        {errorResponse.error}
                                    </span>
                                </div>

                                <div className="flex items-start">
                                    <span className="text-muted-foreground min-w-[4.5rem]">Code:</span>
                                    <span className="text-primary ml-2">
                                        {errorResponse.code}
                                    </span>
                                </div>

                                <div className="flex items-start">
                                    <span className="text-muted-foreground min-w-[4.5rem]">Status:</span>
                                    <span className="text-accent-foreground ml-2">
                                        {errorResponse.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ),
                    duration: 6000,
                    className: "bg-background border border-border rounded-[var(--radius)] p-4 shadow-lg",
                });

                console.error('API Error:', errorResponse);

            } catch (parseError) {
                toast.error('Error Details', {
                    description: (
                        <div className="text-sm text-destructive">
                            {error.message}
                        </div>
                    ),
                    duration: 5000,
                    className: "bg-background border border-border rounded-[var(--radius)] p-4 shadow-lg",
                });
                console.error('Original Error:', error);
            }
        }

    });

    const runtime = useVercelUseChatRuntime(chat);

    return (
        <>

            <AssistantRuntimeProvider runtime={runtime}>
                {children}
            </AssistantRuntimeProvider>
        </>
    );
}

