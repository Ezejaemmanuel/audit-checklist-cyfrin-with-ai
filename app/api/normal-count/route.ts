// app/api/checklist/count/route.ts

import { db } from "@/db";
import { categoriesTable, dataLevel1Table, dataLevel2Table, dataLevel3Table } from "@/db/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

// This endpoint only returns database counts for application use
export async function GET() {
    try {
        const [
            categoriesCount,
            level1Count,
            level2Count,
            level3Count
        ] = await Promise.all([
            db.select({ count: sql`count(*)` }).from(categoriesTable),
            db.select({ count: sql`count(*)` }).from(dataLevel1Table),
            db.select({ count: sql`count(*)` }).from(dataLevel2Table),
            db.select({ count: sql`count(*)` }).from(dataLevel3Table)
        ]);

        const counts = {
            categories: Number(categoriesCount[0].count),
            level1Items: Number(level1Count[0].count),
            level2Items: Number(level2Count[0].count),
            level3Items: Number(level3Count[0].count),
            totalItems: Number(categoriesCount[0].count) +
                Number(level1Count[0].count) +
                Number(level2Count[0].count) +
                Number(level3Count[0].count)
        };

        return NextResponse.json({
            success: true,
            counts
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}