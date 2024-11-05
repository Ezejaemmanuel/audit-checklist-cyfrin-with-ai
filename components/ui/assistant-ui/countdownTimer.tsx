import { Timer } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";

// Countdown Timer Component
export const CountdownTimer = ({ seconds: initialSeconds }: { seconds: number }) => {
    const [seconds, setSeconds] = useState(initialSeconds);

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center gap-2 text-primary font-medium">
            <Timer className="h-4 w-4 animate-pulse" />
            <span>Please wait {seconds} seconds</span>
        </div>
    );
};