// app/api/all-data/route.ts
import { db } from "@/db";
import {
    TransformedCategory,
    TransformedDataLevel1,
    TransformedDataLevel2,
    DataLevel3
} from "@/types";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const rawCategories = await db.query.categoriesTable.findMany({
            with: {
                dataLevel1: {
                    with: {
                        dataLevel2: {
                            with: {
                                dataLevel3: true,
                            },
                        },
                    },
                },
            },
        });

        const formattedAllData: TransformedCategory[] = rawCategories.map((category) => ({
            id: category.id,
            category: category.category,
            description: category.description,
            createdAt: category.createdAt.toISOString(),
            updatedAt: category.updatedAt.toISOString(),
            data: category.dataLevel1.map((level1): TransformedDataLevel1 => ({
                id: level1.id,
                categoryId: level1.categoryId,
                category: level1.category,
                description: level1.description,
                question: level1.question,
                remediation: level1.remediation,
                references: Array.isArray(level1.references)
                    ? level1.references.filter(Boolean).map(ref => ref.trim())
                    : [],
                tags: Array.isArray(level1.tags)
                    ? level1.tags.filter(Boolean).map(tag => tag.trim())
                    : [],
                createdAt: level1.createdAt.toISOString(),
                updatedAt: level1.updatedAt.toISOString(),
                data: level1.dataLevel2.map((level2): TransformedDataLevel2 => ({
                    id: level2.id,
                    parentId: level2.parentId,
                    category: level2.category,
                    description: level2.description,
                    question: level2.question,
                    remediation: level2.remediation,
                    references: Array.isArray(level2.references)
                        ? level2.references.filter(Boolean).map(ref => ref.trim())
                        : [],
                    tags: Array.isArray(level2.tags)
                        ? level2.tags.filter(Boolean).map(tag => tag.trim())
                        : [],
                    createdAt: level2.createdAt.toISOString(),
                    updatedAt: level2.updatedAt.toISOString(),
                    data: level2.dataLevel3.map((level3): DataLevel3 => ({
                        id: level3.id,
                        parentId: level3.parentId,
                        description: level3.description,
                        question: level3.question,
                        remediation: level3.remediation,
                        references: Array.isArray(level3.references)
                            ? level3.references.filter(Boolean).map(ref => ref.trim())
                            : [],
                        tags: Array.isArray(level3.tags)
                            ? level3.tags.filter(Boolean).map(tag => tag.trim())
                            : [],
                        createdAt: level3.createdAt.toISOString(),
                        updatedAt: level3.updatedAt.toISOString()
                    })),
                })),
            })),
        }));

        return NextResponse.json(formattedAllData, {
            headers: {
                'Cache-Control': 'public, max-age=604800',
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}