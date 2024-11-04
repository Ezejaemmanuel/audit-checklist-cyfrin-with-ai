// app/api/checklist/count/check/route.ts
// This endpoint compares GitHub data count with database count
import { db } from '@/db';
import {
    categoriesTable,
    dataLevel1Table,
    dataLevel2Table,
    dataLevel3Table
} from '@/db/schema';
import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

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

interface CountResult {
    categories: number;
    level1Items: number;
    level2Items: number;
    level3Items: number;
    totalItems: number;
}

async function getGitHubCounts(): Promise<CountResult> {
    const response = await fetch('https://raw.githubusercontent.com/Cyfrin/audit-checklist/main/checklist.json');
    if (!response.ok) {
        throw new Error('Failed to fetch GitHub data');
    }
    const data: ChecklistData[] = await response.json();

    let level1Count = 0;
    let level2Count = 0;
    let level3Count = 0;

    data.forEach(category => {
        if (category.data) {
            level1Count += category.data.length;
            category.data.forEach(level1 => {
                if (level1.data) {
                    level2Count += level1.data.length;
                    level1.data.forEach(level2 => {
                        if (level2.data) {
                            level3Count += level2.data.length;
                        }
                    });
                }
            });
        }
    });

    return {
        categories: data.length,
        level1Items: level1Count,
        level2Items: level2Count,
        level3Items: level3Count,
        totalItems: data.length + level1Count + level2Count + level3Count
    };
}

async function getDatabaseCounts(): Promise<CountResult> {
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

    return {
        categories: Number(categoriesCount[0].count),
        level1Items: Number(level1Count[0].count),
        level2Items: Number(level2Count[0].count),
        level3Items: Number(level3Count[0].count),
        totalItems: Number(categoriesCount[0].count) +
            Number(level1Count[0].count) +
            Number(level2Count[0].count) +
            Number(level3Count[0].count)
    };
}

export async function GET() {
    try {
        const [githubCounts, dbCounts] = await Promise.all([
            getGitHubCounts(),
            getDatabaseCounts()
        ]);

        const comparison = {
            github: githubCounts,
            database: dbCounts,
            matches: {
                categories: githubCounts.categories === dbCounts.categories,
                level1Items: githubCounts.level1Items === dbCounts.level1Items,
                level2Items: githubCounts.level2Items === dbCounts.level2Items,
                level3Items: githubCounts.level3Items === dbCounts.level3Items,
                totalItems: githubCounts.totalItems === dbCounts.totalItems
            },
            differences: {
                categories: Math.abs(githubCounts.categories - dbCounts.categories),
                level1Items: Math.abs(githubCounts.level1Items - dbCounts.level1Items),
                level2Items: Math.abs(githubCounts.level2Items - dbCounts.level2Items),
                level3Items: Math.abs(githubCounts.level3Items - dbCounts.level3Items),
                totalItems: Math.abs(githubCounts.totalItems - dbCounts.totalItems)
            }
        };

        return NextResponse.json({
            success: true,
            comparison,
            syncStatus: Object.values(comparison.matches).every(Boolean) ? 'synchronized' : 'not_synchronized'
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}