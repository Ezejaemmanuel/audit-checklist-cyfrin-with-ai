

// // components/DataCard.tsx
// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useCategories } from "@/hooks/useAllData";
// import { LoadingSpinner } from "./LoadingSpinner";
// import { useCompletionStore } from "@/zustand-store";
// import { CircularProgress } from "./circularProgress";
// import { QuestionCard } from "./questionCard";


// export function DataCard() {
//     const { data, isLoading } = useCategories();
//     const { getProgress } = useCompletionStore();

//     if (isLoading) return <LoadingSpinner />;

//     if (!data) {
//         return (
//             <div className="flex items-center justify-center min-h-[60vh]">
//                 <p className="text-destructive text-lg">No data available</p>
//             </div>
//         );
//     }

//     // Calculate total progress
//     const totalProgress = getProgress(data.flatMap(category => category.data));

//     return (
//         <ScrollArea className="h-[calc(100vh-2rem)] w-full">
//             <div className="space-y-6 w-full max-w-5xl mx-auto p-2 sm:p-4 md:p-6">
//                 {/* Overall Progress */}
//                 <Card className="bg-secondary/5">
//                     <CardHeader className="flex flex-row items-center justify-between p-4">
//                         <CardTitle className="text-sm sm:text-base md:text-lg">
//                             Overall Progress
//                         </CardTitle>
//                         <CircularProgress
//                             completed={totalProgress.completed}
//                             total={totalProgress.total}
//                         />
//                     </CardHeader>
//                 </Card>

//                 {/* Categories */}
//                 {data.map((category) => {
//                     const categoryProgress = getProgress(category.data);

//                     return (
//                         <Card key={category.id} className="relative">
//                             <CardHeader className="flex flex-row items-center justify-between p-4">
//                                 <div className="space-y-1">
//                                     <CardTitle className="text-sm sm:text-base md:text-lg text-muted-foreground">
//                                         {category.category}
//                                     </CardTitle>
//                                     <p className="text-xs text-muted-foreground">
//                                         {categoryProgress.completed} of {categoryProgress.total} completed
//                                     </p>
//                                 </div>
//                                 <CircularProgress
//                                     completed={categoryProgress.completed}
//                                     total={categoryProgress.total}
//                                 />
//                             </CardHeader>

//                             <CardContent className="space-y-4">
//                                 {/* Level 1 */}
//                                 {category.data.map((level1, idx1) => {
//                                     const level1Progress = getProgress([level1]);

//                                     return (
//                                         <div key={level1.id} className="space-y-4">
//                                             <div className="flex items-center justify-between">
//                                                 <QuestionCard
//                                                     id={level1.id}
//                                                     description={level1.description}
//                                                     question={level1.question}
//                                                     remediation={level1.remediation}
//                                                     references={level1.references}
//                                                     tags={level1.tags}
//                                                     level="one"
//                                                     index={idx1}
//                                                 />
//                                                 <div className="hidden sm:block">
//                                                     <CircularProgress
//                                                         completed={level1Progress.completed}
//                                                         total={level1Progress.total}
//                                                     />
//                                                 </div>
//                                             </div>

//                                             {/* Level 2 */}
//                                             {level1.data.map((level2, idx2) => {
//                                                 const level2Progress = getProgress([level2]);

//                                                 return (
//                                                     <div key={level2.id} className="ml-4 sm:ml-6 space-y-4">
//                                                         <div className="flex items-center justify-between">
//                                                             <QuestionCard
//                                                                 id={level2.id}
//                                                                 description={level2.description}
//                                                                 question={level2.question}
//                                                                 remediation={level2.remediation}
//                                                                 references={level2.references}
//                                                                 tags={level2.tags}
//                                                                 level="two"
//                                                                 index={idx2}
//                                                             />
//                                                             <div className="hidden sm:block">
//                                                                 <CircularProgress
//                                                                     completed={level2Progress.completed}
//                                                                     total={level2Progress.total}
//                                                                 />
//                                                             </div>
//                                                         </div>

//                                                         {/* Level 3 */}
//                                                         {level2.data.map((level3, idx3) => (
//                                                             <div key={level3.id} className="ml-4 sm:ml-6">
//                                                                 <QuestionCard
//                                                                     id={level3.id}
//                                                                     description={level3.description}
//                                                                     question={level3.question}
//                                                                     remediation={level3.remediation}
//                                                                     references={level3.references}
//                                                                     tags={level3.tags}
//                                                                     level="three"
//                                                                     index={idx3}
//                                                                 />
//                                                             </div>
//                                                         ))}
//                                                     </div>
//                                                 );
//                                             })}
//                                         </div>
//                                     );
//                                 })}
//                             </CardContent>
//                         </Card>
//                     );
//                 })}
//             </div>
//         </ScrollArea>
//     );
// }


// components/DataCard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCategories } from "@/hooks/useAllData";
import { LoadingSpinner } from "./LoadingSpinner";
import { useCompletionStore, useProjectStore } from "@/zustand-store";
import { CircularProgress } from "./circularProgress";
import { QuestionCard } from "./questionCard";
import { toast } from "sonner";

export function DataCard() {
    const { data, isLoading } = useCategories();
    const { getProgress } = useCompletionStore();
    const currentProject = useProjectStore((state) => state.currentProject);


    if (isLoading) return <LoadingSpinner />;
    if (!currentProject) {
        toast.error("No current project found");
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-destructive text-lg">No Project Found</p>
            </div>
        )

    }
    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-destructive text-lg">No data available</p>
            </div>
        );
    }

    // Calculate total progress only for items with questions
    const totalProgress = getProgress(currentProject.id, data || []);


    return (
        <ScrollArea className="h-[calc(100vh-2rem)] w-full">
            <div className="space-y-6 w-full max-w-5xl mx-auto p-1 sm:p-4 md:p-6">
                {/* Overall Progress */}
                <Card className="bg-secondary/5">
                    <CardHeader className="flex flex-row items-center justify-between p-4">
                        <CardTitle className="text-sm sm:text-base md:text-lg">
                            Overall Progress
                        </CardTitle>
                        <CircularProgress
                            completed={totalProgress.completed}
                            total={totalProgress.total}
                        />
                    </CardHeader>
                </Card>

                {/* Categories */}
                {data.map((category) => {
                    // Only calculate progress for items with questions
                    const categoryProgress = getProgress(currentProject.id, [category]);
                    return (
                        <Card key={category.id} className="relative">
                            <CardHeader className="flex flex-row items-center justify-between p-1 md:p-4">
                                <div className="space-y-1">
                                    <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-muted-foreground">
                                        {category.category}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {categoryProgress.completed} of {categoryProgress.total} completed
                                    </p>
                                </div>
                                <CircularProgress
                                    completed={categoryProgress.completed}
                                    total={categoryProgress.total}
                                />
                            </CardHeader>

                            <CardContent className="space-y-1 md:space-y-4">
                                {/* Level 1 */}
                                {category.data.map((level1, idx1) => {
                                    const childrenIds = [
                                        ...level1.data.map(l2 => l2.id),
                                        ...level1.data.flatMap(l2 =>
                                            l2.data?.map(l3 => l3.id) || []
                                        )
                                    ];

                                    return (
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
                                                children={childrenIds}
                                            />

                                            {/* Level 2 */}
                                            {level1.data.map((level2, idx2) => {
                                                const level2ChildrenIds =
                                                    level2.data?.map(l3 => l3.id) || [];

                                                return (
                                                    <div key={level2.id}
                                                        className="ml-2 sm:ml-6 space-y-4"
                                                    >
                                                        <QuestionCard
                                                            id={level2.id}
                                                            description={level2.description}
                                                            question={level2.question}
                                                            remediation={level2.remediation}
                                                            references={level2.references}
                                                            tags={level2.tags}
                                                            level="two"
                                                            index={idx2}
                                                            children={level2ChildrenIds}
                                                        />

                                                        {/* Level 3 */}
                                                        {level2.data?.map((level3, idx3) => (
                                                            <div key={level3.id}
                                                                className="ml-2 sm:ml-6"
                                                            >
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
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </ScrollArea>
    );
}