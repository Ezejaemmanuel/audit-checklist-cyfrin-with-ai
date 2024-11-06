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

const AuthErrorDialog = ({
    error,
    onClose
}: {
    error: APIErrorResponse;
    onClose: () => void;
}) => {
    const [open, setOpen] = useState(true);

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            onClose();
        }
    };

    return (
        <AlertDialog
            open={open}
            onOpenChange={handleOpenChange}
        >
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
                <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
                    <AlertDialogCancel
                        className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                        onClick={() => handleOpenChange(false)}
                    >
                        Cancel
                    </AlertDialogCancel>

                    {/* Remove the AlertDialogAction wrapper */}
                    <SignUpButton >
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                            Sign up
                        </Button>
                    </SignUpButton>

                    <SignInButton >
                        <Button
                            variant="outline"
                            className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                            Sign in
                        </Button>
                    </SignInButton>
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
    const [authError, setAuthError] = useState<APIErrorResponse | null>(null);
    const chat = useChat({
        api: "/api/chat",

        onError: (error: Error) => {
            console.log("this is the error that is thrown by the onError function", error);
            try {
                const errorResponse: APIErrorResponse = JSON.parse(error.message);


                if (errorResponse.code === "RATE_LIMIT_EXCEEDED") {
                    // Extract seconds using regex
                    const secondsMatch = errorResponse.error.match(/(\d+)\s*seconds/);
                    const seconds = secondsMatch ? parseInt(secondsMatch[1]) : 30; // fallback to 30 seconds if not found

                    toast.error('', {
                        description: (
                            <div className="flex flex-col space-y-2.5 text-rose-500">
                                {/* Status Badge */}
                                <div className="inline-flex items-center gap-1.5">
                                    <Timer className="h-3.5 w-3.5  animate-pulse" />
                                    <span className="text-[10px] font-medium tracking-wide ">
                                        Rate Limited
                                    </span>
                                </div>

                                {/* Error Message */}
                                <p className="text-[11px] font-medium leading-relaxed ">
                                    {errorResponse.error}
                                </p>

                                {/* Timer */}
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[10px]">
                                        <CountdownTimer seconds={seconds} />
                                    </span>
                                </div>

                                {/* Alternative Options */}
                                <div className="flex items-center gap-1.5 text-[10px] ">
                                    <span className="opacity-75">Try:</span>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="link"
                                            className="h-auto p-0  inline-flex items-center gap-1 text-[10px]"
                                            onClick={() => window.open('https://chat.openai.com', '_blank')}
                                        >
                                            ChatGPT
                                            <ExternalLink className="h-2.5 w-2.5 opacity-70" />
                                        </Button>
                                        <span className="opacity-50">·</span>
                                        <Button
                                            variant="link"
                                            className="h-auto p-0 inline-flex items-center gap-1 text-[10px]"
                                            onClick={() => window.open('https://www.perplexity.ai', '_blank')}
                                        >
                                            Perplexity
                                            <ExternalLink className="h-2.5 w-2.5 opacity-70" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ),
                        duration: (seconds * 1000), // Convert seconds to milliseconds
                        className: "bg-background border border-border rounded-[var(--radius)] p-4 shadow-lg",
                        style: {
                            padding: '0.75rem',
                        },
                    });
                    return;
                }
                // Enhanced toast styling
                toast.error('', {
                    description: (
                        <div className="flex items-start gap-3 w-full max-w-[300px]">
                            <div className="h-6 w-6 rounded-full bg-rose-200/30 flex items-center justify-center flex-shrink-0">
                                <XCircle className="h-4 w-4 text-rose-500" />
                            </div>

                            <div className="flex flex-col space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center rounded-md bg-rose-50/50 px-2 py-1 text-[10px] font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">
                                        {errorResponse.code}
                                    </span>
                                </div>

                                <p className="text-xs text-rose-700/90 leading-relaxed">
                                    {errorResponse.error}
                                </p>
                            </div>
                        </div>
                    ),
                    duration: 5000,
                    className: "bg-rose-50 border border-rose-200 rounded-lg shadow-sm",
                    style: {
                        padding: '0.75rem',
                    },
                });

                if (errorResponse.code === "AUTHENTICATION_REQUIRED") {
                    setAuthError(errorResponse);
                    return;
                }


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
                {authError && (
                    <AuthErrorDialog
                        error={authError}
                        onClose={() => setAuthError(null)}
                    />
                )}
            </AssistantRuntimeProvider>
        </>
    );
}

