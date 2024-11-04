export const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="w-20 h-20 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="w-20 h-20 border-4 border-destructive rounded-full animate-ping opacity-20"></div>
            </div>
        </div>
        <p className="text-foreground/80 text-lg font-medium animate-pulse">Loading data...</p>
    </div>
);
