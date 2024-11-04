// sidebar-store.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SidebarStore {
    activeId: string | null;
    expandedCategories: string[];
    toggleCategory: (category: string) => void;
    setActiveId: (id: string | null) => void;
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

interface CompletionState {
    completedItems: string[];
    toggleCompletion: (id: string) => void;
    clearCompleted: () => void;
    isCompleted: (id: string) => boolean;
}

export const useCompletionStore = create<CompletionState>()(
    persist(
        (set, get) => ({
            completedItems: [],
            toggleCompletion: (id: string) =>
                set((state) => ({
                    completedItems: state.completedItems.includes(id)
                        ? state.completedItems.filter((item) => item !== id)
                        : [...state.completedItems, id],
                })),
            clearCompleted: () => set({ completedItems: [] }),
            isCompleted: (id: string) => get().completedItems.includes(id),
        }),
        {
            name: 'quiz-completion-storage',
            storage: createJSONStorage(() => localStorage),
            version: 1,
        }
    )
);

