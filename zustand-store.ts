// sidebar-store.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SidebarStore {
    activeId: string | null;
    expandedCategories: string[];
    toggleCategory: (category: string) => void;
    setActiveId: (id: string | null) => void;
    scrollToItem: (id: string) => void;
    resetState: () => void;
}

export const useSidebarStore = create<SidebarStore>()(
    persist(
        (set) => ({
            activeId: null,
            expandedCategories: [],

            setActiveId: (id: string | null) => set((state) => ({
                ...state,
                activeId: id
            })),

            scrollToItem: (id: string) => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    set({ activeId: id });
                }
            },

            toggleCategory: (category: string) => set((state) => {
                const isCurrentlyExpanded = state.expandedCategories.includes(category);
                const newExpandedCategories = isCurrentlyExpanded
                    ? state.expandedCategories.filter((c) => c !== category)
                    : [...state.expandedCategories, category];

                return {
                    ...state,
                    expandedCategories: newExpandedCategories
                };
            }),

            resetState: () => set({
                activeId: null,
                expandedCategories: [],
            }),
        }),
        {
            name: 'sidebar-storage',
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state: SidebarStore) => ({
                expandedCategories: state.expandedCategories,
                activeId: state.activeId
            }),
            version: 1,
        }
    )
);



// interface CompletionState {
//     completedItems: string[];
//     toggleCompletion: (id: string) => void;
//     clearCompleted: () => void;
//     isCompleted: (id: string) => boolean;
// }

// export const useCompletionStore = create<CompletionState>()(
//     persist(
//         (set, get) => ({
//             completedItems: [],
//             toggleCompletion: (id: string) =>
//                 set((state) => ({
//                     completedItems: state.completedItems.includes(id)
//                         ? state.completedItems.filter((item) => item !== id)
//                         : [...state.completedItems, id],
//                 })),
//             clearCompleted: () => set({ completedItems: [] }),
//             isCompleted: (id: string) => get().completedItems.includes(id),
//         }),
//         {
//             name: 'quiz-completion-storage',
//             storage: createJSONStorage(() => localStorage),
//             version: 1,
//         }
//     )
// );
// zustand-store.ts

interface CompletionState {
    completedItems: string[];
    toggleCompletion: (id: string, children?: string[]) => void;
    clearCompleted: () => void;
    isCompleted: (id: string) => boolean;
    getProgress: (items: any[]) => { completed: number; total: number };
}

export const useCompletionStore = create<CompletionState>()(
    persist(
        (set, get) => ({
            completedItems: [],

            toggleCompletion: (id: string, children: string[] = []) =>
                set((state) => {
                    const isCurrentlyCompleted = state.completedItems.includes(id);

                    // If item is completed, remove it and its children
                    if (isCurrentlyCompleted) {
                        return {
                            completedItems: state.completedItems.filter(
                                (item) => item !== id && !children.includes(item)
                            ),
                        };
                    }

                    // If item is not completed, add it and its children
                    return {
                        completedItems: [...new Set([...state.completedItems, id, ...children])],
                    };
                }),

            clearCompleted: () => set({ completedItems: [] }),

            isCompleted: (id: string) => get().completedItems.includes(id),

            getProgress: (items: any[]) => {
                const completedItems = get().completedItems;
                let completed = 0;
                let total = 0;

                // Recursive function to count items at all levels
                const countNestedItems = (item: any) => {
                    // Count current item if it has a question
                    if (item.question) {
                        total++;
                        if (completedItems.includes(item.id)) {
                            completed++;
                        }
                    }

                    // Process level 2 items
                    if (item.data && Array.isArray(item.data)) {
                        item.data.forEach((level2Item: any) => {
                            if (level2Item.question) {
                                total++;
                                if (completedItems.includes(level2Item.id)) {
                                    completed++;
                                }
                            }

                            // Process level 3 items
                            if (level2Item.data && Array.isArray(level2Item.data)) {
                                level2Item.data.forEach((level3Item: any) => {
                                    if (level3Item.question) {
                                        total++;
                                        if (completedItems.includes(level3Item.id)) {
                                            completed++;
                                        }
                                    }
                                });
                            }
                        });
                    }
                };

                // Process all items in the array
                items.forEach(countNestedItems);

                return { completed, total };
            },
        }),
        {
            name: 'quiz-completion-storage',
            storage: createJSONStorage(() => localStorage),
            version: 1,
        }
    )
);