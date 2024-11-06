// components/welcome/WelcomeDialog.tsx
import { ReactNode, useState } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Github,
    Mail,
    ArrowUpRight,
    RefreshCcw,
    MessageSquareText,
    ArrowRight,
    Shield,
    Bot,
    BookOpen,
    Sparkles,
    GitPullRequest
} from 'lucide-react';
import { useWelcomeStore } from '@/zustand-store';


interface WelcomeDialogWrapperProps {
    children: ReactNode;
}

export function WelcomeDialogWrapper({ children }: WelcomeDialogWrapperProps) {
    const { hasSeenWelcome, setHasSeenWelcome } = useWelcomeStore();

    const [isWelcomeOpen, setIsWelcomeOpen] = useState(!hasSeenWelcome);

    // Handle welcome dialog close
    const handleWelcomeClose = () => {
        setIsWelcomeOpen(false);
        setHasSeenWelcome(true);
    };

    return (
        <>
            <Dialog
                open={isWelcomeOpen}
                onOpenChange={(open) => {
                    setIsWelcomeOpen(open);
                    if (!open) handleWelcomeClose();
                }}

            >
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto  z-[100]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                            <Shield className="w-6 h-6" />
                            Welcome to Cyfrin Audit Checklist
                        </DialogTitle>
                        <DialogDescription className="space-y-6">
                            {/* Introduction */}
                            <div className="text-sm space-y-3 text-muted-foreground">
                                <p className="text-foreground font-medium">
                                    Your comprehensive smart contract security companion
                                </p>
                                <p>
                                    Enhance your smart contract security with our state-of-the-art audit checklist platform,
                                    designed to help you identify and prevent vulnerabilities.
                                </p>
                            </div>

                            {/* Key Features */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FeatureCard
                                    icon={<RefreshCcw className="w-5 h-5 text-primary" />}
                                    title="Real-time Updates"
                                    description="Automatically syncs with our GitHub repository for the latest security audit checklist"
                                />
                                <FeatureCard
                                    icon={<Bot className="w-5 h-5 text-primary" />}
                                    title="AI Assistant"
                                    description="Built-in AI helper to explain vulnerabilities and provide guidance"
                                />
                                <FeatureCard
                                    icon={<BookOpen className="w-5 h-5 text-primary" />}
                                    title="Comprehensive Guides"
                                    description="Detailed explanations and best practices for each security check"
                                />
                                <FeatureCard
                                    icon={<Sparkles className="w-5 h-5 text-primary" />}
                                    title="Actively in development"
                                    description="Stay up-to-date with the latest features and improvements"
                                />
                            </div>

                            {/* Contact Section */}
                            <div className="space-y-3 bg-secondary/20 p-4 rounded-lg">
                                <p className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <GitPullRequest className="w-4 h-4" />
                                    Contribute & Connect
                                </p>
                                <div className="flex flex-col gap-2">
                                    <a
                                        href="https://github.com/Ezejaemmanuel/audit-checklist-cyfrin-with-ai"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors group"
                                    >
                                        <Github className="w-4 h-4" />
                                        <span>Report issues or suggest improvements on GitHub</span>
                                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                    <a
                                        href="mailto:ezejaemmanuel36@gmail.com"
                                        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors group"
                                    >
                                        <Mail className="w-4 h-4" />
                                        <span>Contact us via email for support</span>
                                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </div>
                            </div>

                            {/* Version Info */}
                            <div className="text-xs text-muted-foreground">
                                <p>Version 1.0.0 | Last updated: {new Date().toLocaleDateString()}</p>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end mt-4">
                        <Button
                            onClick={() => setHasSeenWelcome(true)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            Get Started
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            {!isWelcomeOpen && children}

        </>
    );
}

// Helper component for feature cards
function FeatureCard({ icon, title, description }: {
    icon: ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="p-4 rounded-lg bg-secondary/10 space-y-2">
            <div className="flex items-center gap-2">
                {icon}
                <h3 className="font-medium text-sm">{title}</h3>
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </div>
    );
}