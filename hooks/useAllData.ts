


// // types.ts
// import { DataLevel3 } from "@/db/schema";

// export interface TransformedCategory {
//     id: string;
//     category: string;
//     description: string;
//     data: (TransformedDataLevel1 | null)[];
// }

// export interface TransformedDataLevel1 {
//     id: string;
//     category: string | null;
//     description: string;
//     question: string | null;
//     data: (TransformedDataLevel2 | null)[];
// }

// export interface TransformedDataLevel2 {
//     id: string;
//     category: string | null;
//     description: string;
//     question: string | null;
//     data: DataLevel3[];
// }

// interface CachedData {
//     data: TransformedCategory[];
//     timestamp: number;
// }

// // hooks/useCategories.ts
// import { useQuery } from "@tanstack/react-query";

// const CACHE_KEY = 'categories_cache';
// const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// async function fetchCategories(): Promise<TransformedCategory[]> {
//     // Check local storage first
//     const cachedData = localStorage.getItem(CACHE_KEY);
//     console.log("cachedData:", cachedData);
//     if (cachedData) {
//         console.log("Using cached data");
//         const parsed: CachedData = JSON.parse(cachedData);
//         const now = Date.now();

//         // Check if cache is still valid
//         if (now - parsed.timestamp < CACHE_DURATION) {
//             return parsed.data;
//         } else {
//             // Clear expired cache
//             localStorage.removeItem(CACHE_KEY);
//         }
//     }

//     // Fetch fresh data if no cache or expired
//     const response = await fetch("/api/all-data");
//     if (!response.ok) {
//         throw new Error("Failed to fetch categories");
//     }

//     const data = await response.json();

//     // Cache the new data
//     const cacheObject: CachedData = {
//         data,
//         timestamp: Date.now()
//     };
//     localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));

//     return data;
// }

// export function useCategories() {
//     return useQuery<TransformedCategory[]>({
//         queryKey: ["categories"],
//         queryFn: fetchCategories,
//         staleTime: CACHE_DURATION, // Prevent unnecessary refetches
//     });
// }

// // Utility function to transform categories
// export function transformCategories(categories: TransformedCategory[]) {
//     return categories.map((category) => ({
//         id: category.id,
//         category: category.category,
//         description: category.description,
//         data: category.data.map((level1) =>
//             level1 ? {
//                 id: level1.id,
//                 category: level1.category,
//                 description: level1.description,
//                 question: level1.question,
//                 data: level1.data.map((level2) =>
//                     level2 ? {
//                         id: level2.id,
//                         category: level2.category,
//                         description: level2.description,
//                         question: level2.question,
//                         data: level2.data,
//                     } : null
//                 ),
//             } : null
//         ),
//     }));
// }



import { TransformedCategory } from "@/types";
// The hook remains the same as it just handles fetching and caching
// hooks/useCategories.ts
import { useQuery } from "@tanstack/react-query";


const CACHE_KEY = 'categories_cache';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

interface CachedData {
    data: TransformedCategory[];
    timestamp: number;
}

async function fetchCategories(): Promise<TransformedCategory[]> {
    const cachedData = localStorage.getItem(CACHE_KEY);

    if (cachedData) {
        const parsed = JSON.parse(cachedData) as CachedData;
        const now = Date.now();

        if (now - parsed.timestamp < CACHE_DURATION) {
            return parsed.data;
        }
        localStorage.removeItem(CACHE_KEY);
    }

    const response = await fetch("/api/all-data");
    if (!response.ok) {
        throw new Error("Failed to fetch categories");
    }

    const data: TransformedCategory[] = await response.json();

    const cacheObject: CachedData = {
        data,
        timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));

    return data;
}

export function useCategories() {
    return useQuery<TransformedCategory[]>({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        staleTime: CACHE_DURATION,
    });
}