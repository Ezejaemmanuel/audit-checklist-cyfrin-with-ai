
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// import { ExternalLink, CheckCircle2, XCircle, Circle } from "lucide-react";
// import { cn } from "@/lib/utils";
// import romans from "romans";
// import { useCompletionStore } from "@/zustand-store";


// // Helper function for alphabet labels
// const getAlphabetLabel = (num: number): string => {
//     const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//     if (num < 26) return alphabet[num];
//     const first = Math.floor(num / 26) - 1;
//     const second = num % 26;
//     return `${alphabet[first]}${alphabet[second]}`;
// };

// interface QuestionCardProps {
//     id: string;
//     description: string;
//     question: string | null;
//     remediation: string | null;
//     references: string[];
//     tags: string[];
//     level: 'one' | 'two' | 'three';
//     index: number;
// }

// export const QuestionCard = ({
//     id,
//     description,
//     question,
//     remediation,
//     references,
//     tags,
//     level,
//     index,
// }: QuestionCardProps) => {
//     const { isCompleted, toggleCompletion } = useCompletionStore();
//     const completed = isCompleted(id);

//     const getLevelIndicator = () => {
//         switch (level) {
//             case 'one':
//                 return romans.romanize(index + 1);
//             case 'two':
//                 return getAlphabetLabel(index);
//             case 'three':
//                 return (index + 1).toString();
//             default:
//                 return index + 1;
//         }
//     };

//     // Responsive text classes
//     const textStyles = {
//         description: "text-sm sm:text-base md:text-lg",
//         question: "text-xs sm:text-sm md:text-base",
//         remediation: "text-xs sm:text-sm md:text-base",
//         references: "text-xs sm:text-sm",
//     };
//     return (
//         <Card
//             id={id}
//             className={cn(
//                 "relative scroll-m-16 transition-all duration-200",
//                 (question || remediation || references.length > 0)
//                     ? "w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto"
//                     : "w-full"
//             )}
//         >
//             {/* Level Indicator */}
//             <div className="absolute -top-2 -left-2 w-6 h-6 sm:w-7 sm:h-7 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs sm:text-sm font-bold">
//                 {getLevelIndicator()}
//             </div>

//             {/* Completion Toggle */}
//             <div className="absolute top-2 right-2 flex items-center gap-2">
//                 <span className="text-xs text-muted-foreground">
//                     {completed ? "Complete" : "Incomplete"}
//                 </span>
//                 <button
//                     onClick={() => toggleCompletion(id)}
//                     className={cn(
//                         "transition-all duration-200 p-1 rounded-full hover:bg-secondary/80",
//                         "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
//                         "relative inline-flex items-center justify-center"
//                     )}
//                     aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
//                 >
//                     {completed ? (
//                         <CheckCircle2
//                             className="w-6 h-6 text-green-500 transition-transform duration-200 hover:scale-110"
//                         />
//                     ) : (
//                         <Circle
//                             className="w-6 h-6 text-muted-foreground transition-transform duration-200 hover:scale-110"
//                         />
//                     )}

//                     {/* Optional tooltip */}
//                     <span className="sr-only">
//                         {completed ? "Completed" : "Mark as complete"}
//                     </span>
//                 </button>
//             </div>

//             <CardContent className="pt-8 px-3 sm:px-4">
//                 {/* Description */}
//                 <h3 className={cn(textStyles.description, "font-semibold mb-3")}>
//                     {description}
//                 </h3>

//                 {/* Question */}
//                 {question && (
//                     <div className="bg-secondary/20 p-2 sm:p-3 rounded-lg mb-3">
//                         <p className={textStyles.question}>
//                             <span className="font-semibold">Q: </span>{question}
//                         </p>
//                     </div>
//                 )}

//                 {/* Remediation */}
//                 {remediation && (
//                     <div className="bg-secondary/10 p-2 sm:p-3 rounded-lg mb-3">
//                         <p className={textStyles.remediation}>
//                             <span className="font-semibold">A: </span>{remediation}
//                         </p>
//                     </div>
//                 )}

//                 {/* References */}
//                 {references.length > 0 && (
//                     <div className="space-y-2">
//                         <h4 className={cn(textStyles.references, "font-semibold")}>
//                             References:
//                         </h4>
//                         <div className="flex flex-wrap gap-1.5">
//                             {references.map((ref, idx) => (
//                                 <TooltipProvider key={idx}>
//                                     <Tooltip>
//                                         <TooltipTrigger asChild>
//                                             <Badge
//                                                 variant="secondary"
//                                                 className="cursor-pointer flex items-center gap-1 text-xs"
//                                                 onClick={() => {
//                                                     if (ref.startsWith('http')) {
//                                                         window.open(ref, '_blank', 'noopener,noreferrer');
//                                                     }
//                                                 }}
//                                             >
//                                                 Ref {idx + 1}
//                                                 {ref.startsWith('http') &&
//                                                     <ExternalLink className="w-3 h-3" />
//                                                 }
//                                             </Badge>
//                                         </TooltipTrigger>
//                                         <TooltipContent>
//                                             <p className="max-w-[250px] text-xs break-words">
//                                                 {ref}
//                                             </p>
//                                         </TooltipContent>
//                                     </Tooltip>
//                                 </TooltipProvider>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 {/* Tags */}
//                 {tags.length > 0 && (
//                     <div className="mt-3">
//                         <div className="flex flex-wrap gap-1.5">
//                             {tags.map((tag, idx) => (
//                                 <Badge key={idx} variant="outline" className="text-xs">
//                                     {tag}
//                                 </Badge>
//                             ))}
//                         </div>
//                     </div>
//                 )}
//             </CardContent>
//         </Card>
//     );
// };


// components/QuestionCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ExternalLink, CheckCircle2, Circle, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
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
    children?: string[];
}


const textStyles = {
    one: {
        description: "text-md font-semibold",
        question: "text-sm sm:text-md ",
        remediation: "text-sm sm:text-md ",
    },
    two: {
        description: "text-sm  font-medium",
        question: "text-sm  ",
        remediation: "text-xs sm:text-base ",
    },
    three: {
        description: "text-xs",
        question: "text-xs  ",
        remediation: "text-xs  ",
    },
};

export const QuestionCard = ({
    id,
    description,
    question,
    remediation,
    references,
    tags,
    level,
    index,
    children = [],
}: QuestionCardProps) => {
    const { isCompleted, toggleCompletion } = useCompletionStore();
    const completed = isCompleted(id);

    // Calculate total progress for all items with questions


    const handleToggle = () => {
        toggleCompletion(id, children);
    };


    const handleAskAI = () => {
        console.log({
            context: {
                id,
                level,
                description,
                question,
                remediation,
                references,
                tags,
            }
        });
    };

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

    return (
        <Card
            id={id}
            className={cn(
                "relative scroll-m-16 transition-all duration-200",
                (question || remediation || references.length > 0)
                    ? "w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto"
                    : "w-full"
            )}
        >
            {/* Level Indicator */}
            <div className="absolute -top-2 -left-2 w-6 h-6 sm:w-7 sm:h-7 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs sm:text-sm font-bold">
                {getLevelIndicator()}
            </div>

            {/* Completion Toggle */}
            <div className="absolute top-2 right-2 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                    {completed ? "Complete" : "Incomplete"}
                </span>
                <button
                    onClick={handleToggle}
                    className={cn(
                        "transition-all duration-200 p-1 rounded-full hover:bg-secondary/80",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    )}
                >
                    {completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500 transition-transform duration-200 hover:scale-110" />
                    ) : (
                        <Circle className="w-6 h-6 text-muted-foreground transition-transform duration-200 hover:scale-110" />
                    )}
                </button>
            </div>

            <CardContent className="pt-8 px-3 sm:px-4">
                {/* Description */}
                <h3 className={cn(textStyles[level].description, "mb-3")}>
                    {description}
                </h3>

                {/* Question */}
                {question && (
                    <div className="bg-secondary/20 p-2 sm:p-3 rounded-lg mb-3">
                        <p className={textStyles[level].question}>
                            <span className="font-semibold">Q: </span>{question}
                        </p>
                    </div>
                )}

                {/* Remediation */}
                {remediation && (
                    <div className="bg-secondary/10 p-2 sm:p-3 rounded-lg mb-3">
                        <p className={textStyles[level].remediation}>
                            <span className="font-semibold">A: </span>{remediation}
                        </p>
                    </div>
                )}

                {/* References */}
                {references.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold">References:</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {references.map((ref, idx) => (
                                <TooltipProvider key={idx}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Badge
                                                variant="secondary"
                                                className="cursor-pointer flex items-center gap-1 text-xs"
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
                                            <p className="max-w-[250px] text-xs break-words">{ref}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                    <div className="mt-3">
                        <div className="flex flex-wrap gap-1.5">
                            {tags.map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* AI Helper */}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={handleAskAI}
                                className="absolute bottom-2 right-2 text-primary hover:text-primary/80"
                            >
                                <Bot className="w-6 h-6 " />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Ask AI</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardContent>
        </Card>
    );
};