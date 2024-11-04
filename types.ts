// Cache interface for local storage
export interface CachedData {
    data: TransformedCategory[];
    timestamp: number;
}

// Root level category
export interface TransformedCategory {
    id: string;
    category: string;
    description: string;
    data: TransformedDataLevel1[];
    createdAt: string;
    updatedAt: string;
}

// Level 1 data
export interface TransformedDataLevel1 {
    id: string;
    categoryId: string;
    category: string | null;
    description: string;
    question: string | null;
    remediation: string | null;
    references: string[];
    tags: string[];
    createdAt: string;
    updatedAt: string;
    data: TransformedDataLevel2[];
}

// Level 2 data
export interface TransformedDataLevel2 {
    id: string;
    parentId: string;
    category: string | null;
    description: string;
    question: string | null;
    remediation: string | null;
    references: string[];
    tags: string[];
    createdAt: string;
    updatedAt: string;
    data: DataLevel3[];
}

// Level 3 data
export interface DataLevel3 {
    id: string;
    parentId: string;
    description: string;
    question: string;
    remediation: string;
    references: string[];
    tags: string[];
    createdAt: string;
    updatedAt: string;
}
