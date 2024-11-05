// // components/CircularProgress.tsx
// import { CheckCircle2, XCircle } from "lucide-react";

// interface CircularProgressProps {
//     completed: number;
//     total: number;
// }

// export const CircularProgress = ({ completed, total }: CircularProgressProps) => {
//     const percentage = Math.round((completed / total) * 100);
//     const circumference = 2 * Math.PI * 30;
//     const offset = ((100 - percentage) / 100) * circumference;

//     return (
//         <div className="relative flex flex-col items-center gap-2">
//             <div className="relative inline-flex items-center justify-center">
//                 <svg className="w-16 h-16 rotate-[-90deg]">
//                     <circle
//                         className="text-muted stroke-current"
//                         strokeWidth="5"
//                         fill="transparent"
//                         r="30"
//                         cx="32"
//                         cy="32"
//                     />
//                     <circle
//                         className="text-primary stroke-current"
//                         strokeWidth="5"
//                         strokeDasharray={circumference}
//                         strokeDashoffset={offset}
//                         strokeLinecap="round"
//                         fill="transparent"
//                         r="30"
//                         cx="32"
//                         cy="32"
//                     />
//                 </svg>
//                 <span className="absolute text-xs font-medium">{`${percentage}%`}</span>
//             </div>
//             <div className="flex items-center gap-2 text-xs">
//                 <div className="flex items-center gap-1">
//                     <CheckCircle2 className="w-4 h-4 text-green-500" />
//                     <span>{completed}</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                     <XCircle className="w-4 h-4 text-red-500" />
//                     <span>{total - completed}</span>
//                 </div>
//             </div>
//         </div>
//     );
// };


// components/CircularProgress.tsx
import { CheckCircle2, XCircle } from "lucide-react";

interface CircularProgressProps {
    completed: number;
    total: number;
}

export const CircularProgress = ({ completed, total }: CircularProgressProps) => {
    // Handle edge cases
    const safeCompleted = Number(completed) || 0;
    const safeTotal = Number(total) || 1; // Prevent division by zero

    // Calculate percentage safely
    const percentage = safeTotal > 0 ? Math.round((safeCompleted / safeTotal) * 100) : 0;
    const circumference = 2 * Math.PI * 30;

    // Ensure offset is a valid number
    const offset = circumference - ((percentage / 100) * circumference);

    // Convert to string to prevent React warning
    const strokeDashoffset = offset.toString();

    return (
        <div className="relative flex flex-col items-center gap-2">
            <div className="relative inline-flex items-center justify-center">
                <svg className="w-16 h-16 rotate-[-90deg]">
                    <circle
                        className="text-muted stroke-current"
                        strokeWidth="5"
                        fill="transparent"
                        r="30"
                        cx="32"
                        cy="32"
                    />
                    <circle
                        className="text-primary stroke-current"
                        strokeWidth="5"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                        r="30"
                        cx="32"
                        cy="32"
                    />
                </svg>
                <span className="absolute text-xs font-medium">{`${percentage}%`}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>{safeCompleted}</span>
                </div>
                <div className="flex items-center gap-1">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span>{safeTotal - safeCompleted}</span>
                </div>
            </div>
        </div>
    );
};