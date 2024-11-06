// sidebar-store.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createId } from '@paralleldrive/cuid2';
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
//     toggleCompletion: (id: string, children?: string[]) => void;
//     clearCompleted: () => void;
//     isCompleted: (id: string) => boolean;
//     getProgress: (items: any[]) => { completed: number; total: number };
// }

// export const useCompletionStore = create<CompletionState>()(
//     persist(
//         (set, get) => ({
//             completedItems: [],

//             toggleCompletion: (id: string, children: string[] = []) =>
//                 set((state) => {
//                     const isCurrentlyCompleted = state.completedItems.includes(id);

//                     // If item is completed, remove it and its children
//                     if (isCurrentlyCompleted) {
//                         return {
//                             completedItems: state.completedItems.filter(
//                                 (item) => item !== id && !children.includes(item)
//                             ),
//                         };
//                     }

//                     // If item is not completed, add it and its children
//                     return {
//                         completedItems: [...new Set([...state.completedItems, id, ...children])],
//                     };
//                 }),

//             clearCompleted: () => set({ completedItems: [] }),

//             isCompleted: (id: string) => get().completedItems.includes(id),

//             getProgress: (items: any[]) => {
//                 const completedItems = get().completedItems;
//                 let completed = 0;
//                 let total = 0;

//                 // Recursive function to count items at all levels
//                 const countNestedItems = (item: any) => {
//                     // Count current item if it has a question
//                     if (item.question) {
//                         total++;
//                         if (completedItems.includes(item.id)) {
//                             completed++;
//                         }
//                     }

//                     // Process level 2 items
//                     if (item.data && Array.isArray(item.data)) {
//                         item.data.forEach((level2Item: any) => {
//                             if (level2Item.question) {
//                                 total++;
//                                 if (completedItems.includes(level2Item.id)) {
//                                     completed++;
//                                 }
//                             }

//                             // Process level 3 items
//                             if (level2Item.data && Array.isArray(level2Item.data)) {
//                                 level2Item.data.forEach((level3Item: any) => {
//                                     if (level3Item.question) {
//                                         total++;
//                                         if (completedItems.includes(level3Item.id)) {
//                                             completed++;
//                                         }
//                                     }
//                                 });
//                             }
//                         });
//                     }
//                 };

//                 // Process all items in the array
//                 items.forEach(countNestedItems);

//                 return { completed, total };
//             },
//         }),
//         {
//             name: 'quiz-completion-storage',
//             storage: createJSONStorage(() => localStorage),
//             version: 1,
//         }
//     )
// );



// stores/store.ts


// Project Store Types
export interface Project {
    id: string;
    name: string;
    lastUpdatedAt: Date;
}
// Completion Store Types
interface CompletionState {
    completionData: Record<string, { // projectId -> completion data
        completedItems: string[];
    }>;
    toggleCompletion: (projectId: string, id: string, children?: string[]) => void;
    clearCompleted: (projectId: string) => void;
    isCompleted: (projectId: string, id: string) => boolean;
    getProgress: (projectId: string, items: any[]) => { completed: number; total: number };
}



interface ProjectStore {
    projects: Project[];
    currentProject: Project | null;
    addProject: (name: string) => boolean;
    setCurrentProject: (project: Project) => void;
    getLatestProject: () => Project | null;
    updateProjectTimestamp: (projectId: string) => void;
    initiateNewProject: () => void;

}



// Project Store Implementation
export const useProjectStore = create<ProjectStore>()(
    persist(
        (set, get) => ({
            projects: [],
            currentProject: null,
            initiateNewProject: () => {
                set({ currentProject: null });
            },

            addProject: (name: string) => {
                const { projects } = get();
                const normalizedName = name.trim().toLowerCase();

                if (projects.some(p => p.name.toLowerCase() === normalizedName)) {
                    return false;
                }

                const newProject = {
                    id: createId(),
                    name: name.trim(),
                    lastUpdatedAt: new Date(),
                };

                set((state) => ({
                    projects: [...state.projects, newProject],
                    currentProject: newProject,
                }));
                return true;
            },

            setCurrentProject: (project: Project) => {
                set({ currentProject: project });
            },

            getLatestProject: () => {
                const { projects } = get();
                return projects.length > 0
                    ? projects.sort((a, b) =>
                        new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime()
                    )[0]
                    : null;
            },

            updateProjectTimestamp: (projectId: string) => {
                set((state) => ({
                    projects: state.projects.map(p =>
                        p.id === projectId
                            ? { ...p, lastUpdatedAt: new Date() }
                            : p
                    )
                }));
            },
        }),
        {
            name: 'audit-project-storage',
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                projects: state.projects,
                currentProject: state.currentProject,
            }),
        }
    )
);

// Completion Store Implementation
export const useCompletionStore = create<CompletionState>()(
    persist(
        (set, get) => ({
            completionData: {},

            toggleCompletion: (projectId: string, id: string, children: string[] = []) => {
                set((state) => {
                    const projectData = state.completionData[projectId] || { completedItems: [] };
                    const isCurrentlyCompleted = projectData.completedItems.includes(id);

                    const newCompletedItems = isCurrentlyCompleted
                        ? projectData.completedItems.filter(
                            item => item !== id && !children.includes(item)
                        )
                        : [...new Set([...projectData.completedItems, id, ...children])];

                    // Update project timestamp
                    useProjectStore.getState().updateProjectTimestamp(projectId);

                    return {
                        completionData: {
                            ...state.completionData,
                            [projectId]: {
                                completedItems: newCompletedItems,
                            },
                        },
                    };
                });
            },

            clearCompleted: (projectId: string) => {
                set((state) => ({
                    completionData: {
                        ...state.completionData,
                        [projectId]: {
                            completedItems: [],
                        },
                    },
                }));
            },

            isCompleted: (projectId: string, id: string) => {
                const state = get();
                return state.completionData[projectId]?.completedItems.includes(id) || false;
            },

            getProgress: (projectId: string, items: any[]) => {
                const state = get();
                const completedItems = state.completionData[projectId]?.completedItems || [];
                let completed = 0;
                let total = 0;

                const countNestedItems = (item: any) => {
                    if (item.question) {
                        total++;
                        if (completedItems.includes(item.id)) {
                            completed++;
                        }
                    }

                    if (item.data && Array.isArray(item.data)) {
                        item.data.forEach(countNestedItems);
                    }
                };

                items.forEach(countNestedItems);
                return { completed, total };
            },
        }),
        {
            name: 'audit-completion-storage',
            storage: createJSONStorage(() => localStorage),
            version: 1,
        }
    )
);

