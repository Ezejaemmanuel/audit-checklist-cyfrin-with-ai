// components/DataCard.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/useAllData";
import { LoadingSpinner } from "./LoadingSpinner";

export function DataCard() {
    const { data, isLoading } = useCategories();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-destructive text-lg">No data available</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-[900px] mx-auto p-6">
            {data.map((category, categoryIndex) => (
                <Card
                    key={category.id}
                    className="relative border-2 border-border/20 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-destructive rounded-full flex items-center justify-center text-destructive-foreground font-bold shadow-lg">
                        {categoryIndex + 1}
                    </div>
                    <CardHeader className="p-6">
                        <CardTitle>
                            <span className="text-foreground font-bold">{category.category}</span>
                        </CardTitle>
                        <p className="text-muted-foreground mt-2">{category.description}</p>
                    </CardHeader>

                    <CardContent className="space-y-6 px-6 pb-6">
                        {category.data.map((level1, level1Index) => (
                            <div key={level1?.id} className="relative">
                                <div className="absolute -top-3 -right-3 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold shadow-md">
                                    {level1Index + 1}
                                </div>
                                <Card className="border border-border/20 hover:border-border/40 transition-all duration-300">
                                    <CardContent className="p-4">
                                        <span className="text-foreground font-semibold block mb-4">
                                            {level1?.description}
                                        </span>

                                        <div className="space-y-4">
                                            {level1?.data.map((level2, level2Index) => (
                                                <div key={level2?.id} className="relative">
                                                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-accent-foreground text-sm font-bold shadow-sm">
                                                        {level2Index + 1}
                                                    </div>
                                                    <Card className="border border-border/20 hover:border-border/40 transition-all duration-300">
                                                        <CardContent className="p-4">
                                                            <span className="text-foreground font-medium block mb-4">
                                                                {level2?.description}
                                                            </span>

                                                            <div className="space-y-4">
                                                                {level2?.data.map((level3, level3Index) => (
                                                                    <Card
                                                                        key={level3.id}
                                                                        className={cn(
                                                                            "relative border border-border/20",
                                                                            "hover:border-border/40 transition-all duration-300",
                                                                            "bg-background/50 backdrop-blur-sm"
                                                                        )}
                                                                    >
                                                                        <div className="absolute -top-3 -right-3 w-6 h-6 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-sm font-bold shadow-sm">
                                                                            {level3Index + 1}
                                                                        </div>
                                                                        <CardContent className="p-4 space-y-3">
                                                                            <h4 className="font-semibold text-foreground text-lg">
                                                                                {level3.description}
                                                                            </h4>
                                                                            <div className="space-y-2">
                                                                                <div className="bg-secondary/20 p-3 rounded-lg">
                                                                                    <p className="text-foreground">
                                                                                        <span className="font-semibold">Q: </span>
                                                                                        {level3.question}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="bg-secondary/10 p-3 rounded-lg">
                                                                                    <p className="text-foreground">
                                                                                        <span className="font-semibold">A: </span>
                                                                                        {level3.remediation}
                                                                                    </p>
                                                                                </div>
                                                                                {level3.references && level3.references.length > 0 && (
                                                                                    <div className="mt-4">
                                                                                        <h5 className="text-foreground font-semibold mb-2">References:</h5>
                                                                                        <ul className="list-disc pl-5 space-y-1">
                                                                                            {level3.references.map((ref, index) => (
                                                                                                <li key={index} className="text-muted-foreground">
                                                                                                    {ref}
                                                                                                </li>
                                                                                            ))}
                                                                                        </ul>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </CardContent>
                                                                    </Card>
                                                                ))}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}