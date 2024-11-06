import { useState, useEffect } from "react";

// Update CountdownTimer component
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
        <span>
            Please wait {seconds}s
        </span>
    );
};