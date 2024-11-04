// // components/DataCard.tsx
// "use client";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { cn } from "@/lib/utils";
// import { useCategories } from "@/hooks/useAllData";
// import { LoadingSpinner } from "./LoadingSpinner";

// export function DataCard() {
//     const { data, isLoading } = useCategories();

//     if (isLoading) {
//         return <LoadingSpinner />;
//     }

//     if (!data) {
//         return (
//             <div className="flex items-center justify-center min-h-[60vh]">
//                 <p className="text-destructive text-lg">No data available</p>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-8 max-w-[900px] mx-auto p-6">
//             {data.map((category, categoryIndex) => (
//                 <Card
//                     key={category.id}
//                     className="relative border-2 border-border/20 shadow-lg hover:shadow-xl transition-all duration-300"
//                 >
//                     <div className="absolute -top-3 -right-3 w-8 h-8 bg-destructive rounded-full flex items-center justify-center text-destructive-foreground font-bold shadow-lg">
//                         {categoryIndex + 1}
//                     </div>
//                     <CardHeader className="p-6">
//                         <CardTitle>
//                             <span className="text-foreground font-bold">{category.category}</span>
//                         </CardTitle>
//                         <p className="text-muted-foreground mt-2">{category.description}</p>
//                     </CardHeader>

//                     <CardContent className="space-y-6 px-6 pb-6">
//                         {category.data.map((level1, level1Index) => (
//                             <div key={level1?.id} className="relative">
//                                 <div className="absolute -top-3 -right-3 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold shadow-md">
//                                     {level1Index + 1}
//                                 </div>
//                                 <Card className="border border-border/20 hover:border-border/40 transition-all duration-300">
//                                     <CardContent className="p-4">
//                                         <span className="text-foreground font-semibold block mb-4">
//                                             {level1?.description}
//                                         </span>

//                                         <div className="space-y-4">
//                                             {level1?.data.map((level2, level2Index) => (
//                                                 <div key={level2?.id} className="relative">
//                                                     <div className="absolute -top-3 -right-3 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-accent-foreground text-sm font-bold shadow-sm">
//                                                         {level2Index + 1}
//                                                     </div>
//                                                     <Card className="border border-border/20 hover:border-border/40 transition-all duration-300">
//                                                         <CardContent className="p-4">
//                                                             <span className="text-foreground font-medium block mb-4">
//                                                                 {level2?.description}
//                                                             </span>

//                                                             <div className="space-y-4">
//                                                                 {level2?.data.map((level3, level3Index) => (
//                                                                     <Card
//                                                                         key={level3.id}
//                                                                         className={cn(
//                                                                             "relative border border-border/20",
//                                                                             "hover:border-border/40 transition-all duration-300",
//                                                                             "bg-background/50 backdrop-blur-sm"
//                                                                         )}
//                                                                     >
//                                                                         <div className="absolute -top-3 -right-3 w-6 h-6 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-sm font-bold shadow-sm">
//                                                                             {level3Index + 1}
//                                                                         </div>
//                                                                         <CardContent className="p-4 space-y-3">
//                                                                             <h4 className="font-semibold text-foreground text-lg">
//                                                                                 {level3.description}
//                                                                             </h4>
//                                                                             <div className="space-y-2">
//                                                                                 <div className="bg-secondary/20 p-3 rounded-lg">
//                                                                                     <p className="text-foreground">
//                                                                                         <span className="font-semibold">Q: </span>
//                                                                                         {level3.question}
//                                                                                     </p>
//                                                                                 </div>
//                                                                                 <div className="bg-secondary/10 p-3 rounded-lg">
//                                                                                     <p className="text-foreground">
//                                                                                         <span className="font-semibold">A: </span>
//                                                                                         {level3.remediation}
//                                                                                     </p>
//                                                                                 </div>
//                                                                                 {level3.references && level3.references.length > 0 && (
//                                                                                     <div className="mt-4">
//                                                                                         <h5 className="text-foreground font-semibold mb-2">References:</h5>
//                                                                                         <ul className="list-disc pl-5 space-y-1">
//                                                                                             {level3.references.map((ref, index) => (
//                                                                                                 <li key={index} className="text-muted-foreground">
//                                                                                                     {ref}
//                                                                                                 </li>
//                                                                                             ))}
//                                                                                         </ul>
//                                                                                     </div>
//                                                                                 )}
//                                                                             </div>
//                                                                         </CardContent>
//                                                                     </Card>
//                                                                 ))}
//                                                             </div>
//                                                         </CardContent>
//                                                     </Card>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                             </div>
//                         ))}
//                     </CardContent>
//                 </Card>
//             ))}
//         </div>
//     );
// }



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