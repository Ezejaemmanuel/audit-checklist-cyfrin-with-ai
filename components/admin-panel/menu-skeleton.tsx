import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export function MenuSkeleton({ isOpen }: { isOpen: boolean | undefined }) {
    return (
        <div className="mt-8 px-3 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton
                        className={cn(
                            "h-11 w-full rounded-md",
                            isOpen === false ? "w-12" : "w-full"
                        )}
                    />
                    {isOpen && i % 2 === 0 && (
                        <div className="ml-4 space-y-2">
                            {Array.from({ length: 3 }).map((_, j) => (
                                <Skeleton key={j} className="h-9 w-[calc(100%-16px)]" />
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}