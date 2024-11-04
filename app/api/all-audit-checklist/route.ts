// // app/api/checklist/route.ts
// import { db } from '@/db';
// import {
//     categoriesTable,
//     dataLevel1Table,
//     dataLevel2Table,
//     dataLevel3Table,
//     resyncHistoryTable
// } from '@/db/schema';
// import { desc, eq } from 'drizzle-orm';
// import { NextResponse } from 'next/server';

// interface ChecklistData {
//     category: string;
//     description: string;
//     data: Array<{
//         category?: string;
//         description: string;
//         data?: Array<{
//             id?: string;
//             question?: string;
//             description: string;
//             remediation?: string;
//             references?: string[];
//             tags?: string[];
//             category?: string;
//             data?: Array<{
//                 id: string;
//                 question: string;
//                 description: string;
//                 remediation: string;
//                 references: string[];
//                 tags: string[];
//             }>;
//         }>;
//     }>;
// }

// async function fetchChecklistData(): Promise<ChecklistData[]> {
//     const response = await fetch('https://raw.githubusercontent.com/Cyfrin/audit-checklist/main/checklist.json');
//     if (!response.ok) {
//         throw new Error('Failed to fetch checklist data');
//     }
//     return await response.json();
// }
// // app/api/checklist/route.ts
// async function shouldResync(): Promise<boolean> {
//     const lastResync = await db
//         .select()
//         .from(resyncHistoryTable)
//         .orderBy(desc(resyncHistoryTable.lastResyncDate))
//         .limit(1);

//     if (lastResync.length === 0) return true;

//     const fourDaysAgo = new Date();
//     fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
//     return lastResync[0].lastResyncDate < fourDaysAgo;
// }

// async function clearAllData() {
//     await db.transaction(async (tx) => {
//         // Delete in reverse order of dependencies
//         await tx.delete(dataLevel3Table);
//         await tx.delete(dataLevel2Table);
//         await tx.delete(dataLevel1Table);
//         await tx.delete(categoriesTable);
//         await tx.delete(resyncHistoryTable);
//     });
// }

// async function resyncData(data: ChecklistData[]) {
//     await db.transaction(async (tx) => {
//         for (const categoryData of data) {
//             // Insert category using category name as ID
//             await tx
//                 .insert(categoriesTable)
//                 .values({
//                     id: categoryData.category,
//                     category: categoryData.category,
//                     description: categoryData.description,
//                 });

//             // Handle level 1 data
//             if (categoryData.data) {
//                 for (const level1 of categoryData.data) {
//                     // Create meaningful ID for level 1
//                     const level1Id = `${categoryData.category}-${level1.description.slice(0, 30)}`.toLowerCase().replace(/\s+/g, '-');

//                     await tx
//                         .insert(dataLevel1Table)
//                         .values({
//                             id: level1Id,
//                             categoryId: categoryData.category,
//                             category: level1.category,
//                             description: level1.description,
//                         });

//                     // Handle level 2 data
//                     if (level1.data) {
//                         for (const level2 of level1.data) {
//                             const level2Id = level2.id || `${level1Id}-${level2.description.slice(0, 30)}`.toLowerCase().replace(/\s+/g, '-');

//                             await tx
//                                 .insert(dataLevel2Table)
//                                 .values({
//                                     id: level2Id,
//                                     parentId: level1Id,
//                                     category: level2.category,
//                                     description: level2.description,
//                                     question: level2.question,
//                                     remediation: level2.remediation,
//                                     references: level2.references || [],
//                                     tags: level2.tags || [],
//                                 });

//                             // Handle level 3 data
//                             if (level2.data) {
//                                 for (const level3 of level2.data) {
//                                     await tx
//                                         .insert(dataLevel3Table)
//                                         .values({
//                                             id: level3.id,
//                                             parentId: level2Id,
//                                             description: level3.description,
//                                             question: level3.question,
//                                             remediation: level3.remediation,
//                                             references: level3.references,
//                                             tags: level3.tags,
//                                         });
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         }

//         // Update resync history
//         await tx
//             .insert(resyncHistoryTable)
//             .values({
//                 id: new Date().toISOString(),
//                 lastResyncDate: new Date(),
//             });
//     });
// }

// export async function GET() {
//     try {
//         const needsResync = await shouldResync();

//         if (needsResync) {
//             console.log("Clearing existing data for fresh sync...");
//             await clearAllData();

//             console.log("Fetching new data...");
//             const newData = await fetchChecklistData();

//             console.log("Performing fresh sync...");
//             await resyncData(newData);
//         }

//         // Query data
//         const categories = await db
//             .select()
//             .from(categoriesTable);

//         const result = await Promise.all(
//             categories.map(async (category) => {
//                 const level1Data = await db
//                     .select()
//                     .from(dataLevel1Table)
//                     .where(eq(dataLevel1Table.categoryId, category.id));

//                 return {
//                     ...category,
//                     data: await Promise.all(
//                         level1Data.map(async (l1) => {
//                             const level2Data = await db
//                                 .select()
//                                 .from(dataLevel2Table)
//                                 .where(eq(dataLevel2Table.parentId, l1.id));

//                             return {
//                                 ...l1,
//                                 data: await Promise.all(
//                                     level2Data.map(async (l2) => {
//                                         const level3Data = await db
//                                             .select()
//                                             .from(dataLevel3Table)
//                                             .where(eq(dataLevel3Table.parentId, l2.id));

//                                         return {
//                                             ...l2,
//                                             data: level3Data,
//                                         };
//                                     })
//                                 ),
//                             };
//                         })
//                     ),
//                 };
//             })
//         );

//         return NextResponse.json({
//             success: true,
//             data: result,
//             resync: needsResync,
//         });
//     } catch (error) {
//         console.error('API Error:', error);
//         return NextResponse.json(
//             { success: false, error: 'Internal Server Error' },
//             { status: 500 }
//         );
//     }
// }

// export async function POST() {
//     try {
//         const newData = await fetchChecklistData();
//         await resyncData(newData);

//         return NextResponse.json({
//             success: true,
//             message: 'Data resynced successfully',
//         });
//     } catch (error) {
//         console.error('API Error:', error);
//         return NextResponse.json(
//             { success: false, error: 'Internal Server Error' },
//             { status: 500 }
//         );
//     }
// }


// app/api/checklist/route.ts
import { db } from '@/db';
import {
    categoriesTable,
    dataLevel1Table,
    dataLevel2Table,
    dataLevel3Table,
    resyncHistoryTable
} from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
// Define interfaces for the data structures
// First, let's ensure our interfaces are properly defined
interface BaseItem {
    id?: string;
    description?: string;
    question?: string;
    data?: Array<any>; // We'll make this more specific in the implementation
}

// The function with proper type checking and null handling
function generateUniqueId(
    prefix: string,
    data: BaseItem,
    fallbackCounter: number
): string {
    let idSource = '';

    // Check each possible source in order of preference
    if (data.id) {
        idSource = `${prefix}-${data.id}`;
    } else if (data.description) {
        idSource = `${prefix}-${data.description.slice(0, 30)}`;
    } else if (data.question) {
        idSource = `${prefix}-${data.question.slice(0, 30)}`;
    } else if (data.data && Array.isArray(data.data) && data.data.length > 0 && data.data[0]?.id) {
        idSource = `${prefix}-${data.data[0].id}`;
    } else {
        // Fallback with timestamp and counter
        idSource = `${prefix}-item-${Date.now()}-${fallbackCounter}`;
    }

    // Clean the ID string
    return idSource
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-') // Replace non-alphanumeric chars with hyphens
        .replace(/-+/g, '-') // Replace multiple consecutive hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

interface ChecklistData {
    category: string;
    description: string;
    data: Array<{
        category?: string;
        description: string;
        data?: Array<{
            id?: string;
            question?: string;
            description: string;
            remediation?: string;
            references?: string[];
            tags?: string[];
            category?: string;
            data?: Array<{
                id: string;
                question: string;
                description: string;
                remediation: string;
                references: string[];
                tags: string[];
            }>;
        }>;
    }>;
}

interface SyncStats {
    created: number;
    updated: number;
}

async function fetchChecklistData(): Promise<ChecklistData[]> {
    const response = await fetch('https://raw.githubusercontent.com/Cyfrin/audit-checklist/main/checklist.json');
    if (!response.ok) {
        throw new Error('Failed to fetch checklist data');
    }
    const data = await response.json();
    console.log("Fetched data from GitHub:", data);
    return data;
}

async function shouldResync(): Promise<boolean> {
    const lastResync = await db
        .select()
        .from(resyncHistoryTable)
        .orderBy(desc(resyncHistoryTable.lastResyncDate))
        .limit(1);

    console.log("Last resync:", lastResync);

    if (lastResync.length === 0) return true;

    const fourDaysAgo = new Date();
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

    console.log("Four days ago:", fourDaysAgo);
    console.log("Last resync date:", lastResync[0].lastResyncDate);

    return lastResync[0].lastResyncDate < fourDaysAgo;
}

async function resyncData(data: ChecklistData[]) {
    let level1Counter = 0;
    let level2Counter = 0;
    let level3Counter = 0;


    await db.transaction(async (tx) => {
        console.log("this is the data", data);
        for (const categoryData of data) {
            console.log("this is the categoryData", categoryData);
            try {
                // Upsert category
                console.log("this is the categoryData", categoryData);
                const categoryResult = await tx
                    .insert(categoriesTable)
                    .values({
                        id: categoryData.category,
                        category: categoryData.category,
                        description: categoryData.description,
                    })
                    .onConflictDoUpdate({
                        target: [categoriesTable.id],
                        set: {
                            description: categoryData.description,
                            updatedAt: new Date()
                        }
                    });
                console.log("this is the categoryResult", categoryResult);
                // Handle level 1 data

                if (categoryData.data) {
                    for (const level1 of categoryData.data) {
                        // const level1Id = `${categoryData.category}-${level1.description.slice(0, 30)}`.toLowerCase().replace(/\s+/g, '-');
                        const level1Id = generateUniqueId(
                            categoryData.category,
                            level1,
                            level1Counter++
                        );
                        console.log("this is the level1Id", level1Id);
                        const level1Result = await tx
                            .insert(dataLevel1Table)
                            .values({
                                id: level1Id,
                                categoryId: categoryData.category,
                                category: level1.category,
                                description: level1.description,
                            })
                            .onConflictDoUpdate({
                                target: [dataLevel1Table.id],
                                set: {
                                    category: level1.category,
                                    description: level1.description,
                                    updatedAt: new Date()
                                }
                            });
                        console.log("this is the level1Result", level1Result);


                        // Handle level 2 data
                        if (level1.data) {
                            for (const level2 of level1.data) {
                                // const level2Id = level2.id || `${level1Id}-${level2.description.slice(0, 30)}`.toLowerCase().replace(/\s+/g, '-');
                                const level2Id = level2.id || generateUniqueId(
                                    level1Id,
                                    level2,
                                    level2Counter++
                                );
                                console.log("this is the level2Id", level2Id);
                                const level2Result = await tx
                                    .insert(dataLevel2Table)
                                    .values({
                                        id: level2Id,
                                        parentId: level1Id,
                                        category: level2.category,
                                        description: level2.description,
                                        question: level2.question,
                                        remediation: level2.remediation,
                                        references: level2.references || [],
                                        tags: level2.tags || [],
                                    })
                                    .onConflictDoUpdate({
                                        target: [dataLevel2Table.id],
                                        set: {
                                            category: level2.category,
                                            description: level2.description,
                                            question: level2.question,
                                            remediation: level2.remediation,
                                            references: level2.references || [],
                                            tags: level2.tags || [],
                                            updatedAt: new Date()
                                        }
                                    });
                                console.log("this is the level2Result", level2Result);


                                // Handle level 3 data
                                if (level2.data) {

                                    for (const level3 of level2.data) {
                                        // const level3Id = level3.id || generateUniqueId(
                                        //     level2Id,
                                        //     level3,
                                        //     level3Counter++
                                        // );

                                        console.log("this is the level3", level3);
                                        const level3Result = await tx
                                            .insert(dataLevel3Table)
                                            .values({
                                                id: level3.id,
                                                parentId: level2Id,
                                                description: level3.description,
                                                question: level3.question,
                                                remediation: level3.remediation,
                                                references: level3.references,
                                                tags: level3.tags,
                                            })
                                            .onConflictDoUpdate({
                                                target: [dataLevel3Table.id],
                                                set: {
                                                    description: level3.description,
                                                    question: level3.question,
                                                    remediation: level3.remediation,
                                                    references: level3.references,
                                                    tags: level3.tags,
                                                    updatedAt: new Date()
                                                }
                                            });
                                        console.log("this is the level3Result", level3Result);

                                    }
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error processing category:', categoryData.category, error);
            }
        }
        console.log("this is the tx", tx);
        // Update resync history
        await tx
            .insert(resyncHistoryTable)
            .values({
                id: new Date().toISOString(),
                lastResyncDate: new Date(),
            });
    });
    console.log("this is the resyncData", resyncData);


}

export async function GET() {
    try {
        const needsResync = await shouldResync();
        console.log("Needs resync:", needsResync);

        let syncStats: SyncStats | null = null;

        if (needsResync) {
            console.log("Starting data resync...");
            const newData = await fetchChecklistData();
            await resyncData(newData);
        }

        // Query data
        const categories = await db
            .select()
            .from(categoriesTable);
        console.log("this is the categories", categories);
        const result = await Promise.all(
            categories.map(async (category) => {
                const level1Data = await db
                    .select()
                    .from(dataLevel1Table)
                    .where(eq(dataLevel1Table.categoryId, category.id));

                return {
                    ...category,
                    data: await Promise.all(
                        level1Data.map(async (l1) => {
                            const level2Data = await db
                                .select()
                                .from(dataLevel2Table)
                                .where(eq(dataLevel2Table.parentId, l1.id));

                            return {
                                ...l1,
                                data: await Promise.all(
                                    level2Data.map(async (l2) => {
                                        const level3Data = await db
                                            .select()
                                            .from(dataLevel3Table)
                                            .where(eq(dataLevel3Table.parentId, l2.id));

                                        return {
                                            ...l2,
                                            data: level3Data,
                                        };
                                    })
                                ),
                            };
                        })
                    ),
                };
            })
        );

        console.log("this is the result", result);
        return NextResponse.json({
            success: true,
            data: result,
            resync: needsResync,
            syncStats: syncStats,
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function POST() {
    try {
        console.log("Forced resync requested");
        const newData = await fetchChecklistData();
        const syncStats = await resyncData(newData);

        return NextResponse.json({
            success: true,
            message: 'Data resynced successfully',
            syncStats,
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}



