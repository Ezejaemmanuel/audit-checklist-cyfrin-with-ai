



// components/DataCard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/useAllData";
import { LoadingSpinner } from "./LoadingSpinner";
import romans from "romans";
import { useCompletionStore } from "@/zustand-store";

// Helper function for alphabet labels
const getAlphabetLabel = (num: number): string => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (num < 26) return alphabet[num];

    const first = Math.floor(num / 26) - 1;
    const second = num % 26;
    return `${alphabet[first]}${alphabet[second]}`;
};

interface QuestionCardProps {
    id: string;
    description: string;
    question: string | null;
    remediation: string | null;
    references: string[];
    tags: string[];
    level: 'one' | 'two' | 'three';
    index: number;
}

const QuestionCard = ({
    id,
    description,
    question,
    remediation,
    references,
    tags,
    level,
    index,
}: QuestionCardProps) => {
    const { isCompleted, toggleCompletion } = useCompletionStore();
    const completed = isCompleted(id);

    const getLevelIndicator = () => {
        switch (level) {
            case 'one':
                return romans.romanize(index + 1);
            case 'two':
                return getAlphabetLabel(index);
            case 'three':
                return (index + 1).toString();
            default:
                return index + 1;
        }
    };
    const cardId = `${getLevelIndicator()}-${id}`;
    return (
        <Card

            id={cardId}


            className={cn(
                "relative",
                (question || remediation || references.length > 0) ? "w-[80%] mx-auto" : "w-full"

            )}>
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                {getLevelIndicator()}
            </div>

            <div className="absolute top-2 right-2">
                <CheckCircle2
                    className={cn(
                        "w-6 h-6 transition-colors cursor-pointer",
                        completed ? "text-green-500" : "text-gray-300"
                    )}
                    onClick={() => toggleCompletion(id)}
                />
            </div>

            <CardContent className="pt-6 px-4">
                <h3 className="font-semibold text-lg mb-4">{description}</h3>

                {question && (
                    <div className="bg-secondary/20 p-4 rounded-lg mb-4">
                        <p className="text-foreground">
                            <span className="font-semibold">Q: </span>{question}
                        </p>
                    </div>
                )}

                {remediation && (
                    <div className="bg-secondary/10 p-4 rounded-lg mb-4">
                        <p className="text-foreground">
                            <span className="font-semibold">A: </span>{remediation}
                        </p>
                    </div>
                )}

                {references.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm">References:</h4>
                        <div className="flex flex-wrap gap-2">
                            {references.map((ref, idx) => (
                                <TooltipProvider key={idx}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Badge
                                                variant="secondary"
                                                className="cursor-pointer flex items-center gap-1"
                                                onClick={() => {
                                                    if (ref.startsWith('http')) {
                                                        window.open(ref, '_blank', 'noopener,noreferrer');
                                                    }
                                                }}
                                            >
                                                Ref {idx + 1}
                                                {ref.startsWith('http') && <ExternalLink className="w-3 h-3" />}
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="max-w-[300px] break-words">{ref}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>
                    </div>
                )}

                {tags.length > 0 && (
                    <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, idx) => (
                                <Badge key={idx} variant="outline">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {(question || remediation) && (
                    <div className="flex justify-end items-center gap-2 mt-4">
                        <RadioGroup
                            defaultValue={completed ? "completed" : "pending"}
                            onValueChange={(value) => {
                                if (value === "completed") toggleCompletion(id);
                            }}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="completed" id={`completed-${id}`} />
                                <Label htmlFor={`completed-${id}`}>Mark as completed</Label>
                            </div>
                        </RadioGroup>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export function DataCard() {
    const { data, isLoading } = useCategories();

    if (isLoading) return <LoadingSpinner />;

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-destructive text-lg">No data available</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 w-full max-w-2xl mx-auto p-4 sm:p-6">
            {data.map((category) => (
                <Card key={category.id} className="relative">
                    <CardHeader className="p-4">
                        <CardTitle className="text-sm text-muted-foreground">
                            {category.category}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {category.data.map((level1, idx1) => (
                            <div key={level1.id} className="space-y-4">
                                <QuestionCard
                                    id={level1.id}
                                    description={level1.description}
                                    question={level1.question}
                                    remediation={level1.remediation}
                                    references={level1.references}
                                    tags={level1.tags}
                                    level="one"
                                    index={idx1}
                                />

                                {level1.data.map((level2, idx2) => (
                                    <div key={level2.id} className="ml-6 space-y-4">
                                        <QuestionCard
                                            id={level2.id}
                                            description={level2.description}
                                            question={level2.question}
                                            remediation={level2.remediation}
                                            references={level2.references}
                                            tags={level2.tags}
                                            level="two"
                                            index={idx2}
                                        />

                                        {level2.data.map((level3, idx3) => (
                                            <div key={level3.id} className="ml-6">
                                                <QuestionCard
                                                    id={level3.id}
                                                    description={level3.description}
                                                    question={level3.question}
                                                    remediation={level3.remediation}
                                                    references={level3.references}
                                                    tags={level3.tags}
                                                    level="three"
                                                    index={idx3}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
