
// "use client";

// import { useEffect } from 'react';
// import {
//   Boxes,
//   CircuitBoard,
//   Code2,
//   CodepenIcon,
//   Component,
//   Database,
//   FileCode2,
//   Fingerprint,
//   Layers,
//   LogOut,
//   Network,
//   Shield,
//   Terminal
// } from "lucide-react";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Tooltip,
//   TooltipTrigger,
//   TooltipContent,
//   TooltipProvider
// } from "@/components/ui/tooltip";
// import { useSidebarStore } from '@/zustand-store';
// import { toast } from 'sonner';
// import { MenuSkeleton } from './menu-skeleton';
// import { TransformedCategory, TransformedDataLevel1, TransformedDataLevel2, useCategories } from '@/hooks/useAllData';
// import { DataLevel3 } from '@/db/schema';


// interface MenuProps {
//   isOpen: boolean | undefined;
// }
// type MenuItemType = TransformedCategory | TransformedDataLevel1 | TransformedDataLevel2 | DataLevel3;

// interface CategoryPath {
//   id: string;
//   category: string;
//   description: string;
// }

// const categoryIcons = [
//   Boxes, CircuitBoard, Code2, CodepenIcon, Component,
//   Database, FileCode2, Fingerprint, Layers, Network, Shield, Terminal
// ];


// const MAX_TEXT_LENGTH = 25;

// const truncateText = (text: string, maxLength: number = MAX_TEXT_LENGTH) => {
//   if (!text) return '';
//   if (text.length <= maxLength) return text;
//   return `${text.slice(0, maxLength)}...`;
// };




// // Type guard to check if item has data
// const hasData = (item: MenuItemType): item is TransformedCategory | TransformedDataLevel1 | TransformedDataLevel2 => {
//   return 'data' in item && Array.isArray(item.data);
// };

// // Update the type guard to properly check for category
// const isCategoryValid = (
//   item: MenuItemType
// ): item is TransformedCategory | TransformedDataLevel1 | TransformedDataLevel2 => {
//   return (
//     'category' in item &&
//     typeof (item as any).category === 'string' &&
//     (item as any).category.length > 0
//   );
// };
// const getRandomIcon = (() => {
//   const iconMap = new Map<string, typeof categoryIcons[number]>();
//   return (categoryName: string) => {
//     if (!iconMap.has(categoryName)) {
//       const randomIndex = Math.floor(Math.random() * categoryIcons.length);
//       iconMap.set(categoryName, categoryIcons[randomIndex]);
//     }
//     return iconMap.get(categoryName)!;
//   };
// })();

// // Update the generateUniqueId function to handle all possible types
// const generateUniqueId = (
//   item: MenuItemType,
//   index: number
// ): string => {
//   // First check if the item has an id
//   if ('id' in item && item.id) {
//     return item.id;
//   }

//   // Then check if it has a category
//   if (isCategoryValid(item)) {
//     return `${item.category}-${index}`;
//   }

//   // Fallback to using just the index
//   return `item-${index}`;
// };
// const hasCategory = (item: MenuItemType): item is TransformedCategory | TransformedDataLevel1 | TransformedDataLevel2 => {
//   return 'category' in item && typeof item.category === 'string';
// };

// export function Menu({ isOpen }: MenuProps) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const { data: categories, isLoading } = useCategories();

//   const {
//     expandedCategories,
//     toggleCategory,
//     activeCategory,
//     setActiveCategory,
//     syncWithUrl
//   } = useSidebarStore();

//   useEffect(() => {
//     if (searchParams.size > 0 && categories) {  // Add check for categories
//       const isValid = useSidebarStore.getState().syncWithUrl(searchParams, categories);

//       if (!isValid) {
//         toast.error('Invalid navigation path', {
//           description: 'Redirecting to home page',
//           duration: 3000,
//         });

//         // Reset the store state
//         useSidebarStore.getState().resetState();

//         // Remove search params and redirect
//         router.replace(pathname);
//       }
//     }
//   }, [searchParams, categories, router, pathname]);

//   if (isLoading) {
//     return <MenuSkeleton isOpen={isOpen} />;
//   }

//   if (!categories) {
//     return null;
//   }
//   const createQueryString = (paths: CategoryPath[], itemId?: string) => {
//     const newSearchParams = new URLSearchParams();

//     paths.forEach((path, index) => {
//       newSearchParams.set(`category${index + 1}`, path.category);
//       newSearchParams.set(`categoryId${index + 1}`, path.id);
//     });

//     newSearchParams.set('levels', paths.length.toString());

//     if (itemId) {
//       newSearchParams.set('itemId', itemId);
//     }

//     return newSearchParams.toString();
//   };

//   // const handleNavigation = (
//   //   categoryPaths: CategoryPath[],
//   //   itemId?: string
//   // ) => {
//   //   const queryString = createQueryString(categoryPaths, itemId);
//   //   router.push(`${pathname}?${queryString}`);
//   // };

//   const handleNavigation = (
//     categoryPaths: CategoryPath[],
//     itemId?: string
//   ) => {
//     if (itemId) {
//       // For data items, maintain existing query params and add hash
//       const queryString = createQueryString(categoryPaths);
//       const newUrl = `${pathname}${queryString ? '?' + queryString : ''}#${itemId}`;
//       // Use replaceState to avoid adding new entries to browser history
//     } else {
//       // For categories, use query params as before
//       const queryString = createQueryString(categoryPaths);
//     }
//   };

//   const buildCategoryPath = (
//     item: MenuItemType,
//     parentPaths: CategoryPath[] = [],
//     index: number = 0
//   ): CategoryPath[] => {
//     const uniqueId = generateUniqueId(item, index);

//     // Ensure category is always a string by using nullish coalescing
//     const categoryValue = hasCategory(item) ? (item.category ?? uniqueId) : uniqueId;

//     return [
//       ...parentPaths,
//       {
//         id: uniqueId,
//         category: categoryValue, // Now this will always be a string
//         description: item.description
//       }
//     ];
//   };



//   const renderCategory = (
//     category: MenuItemType,
//     level = 0,
//     parentPaths: CategoryPath[] = [],
//     index: number = 0
//   ) => {
//     // Early return if category is not valid or doesn't have required properties
//     if (!isCategoryValid(category)) return null;
//     if (!category.category) return null;

//     const currentPaths = buildCategoryPath(category, parentPaths, index);
//     const isExpanded = expandedCategories.includes(category.category);
//     const Icon = getRandomIcon(category.category);
//     const uniqueId = generateUniqueId(category, index);
//     const isActive = activeCategory === uniqueId;

//     // Type guard for checking if item has data array
//     const hasData = (
//       item: MenuItemType
//     ): item is TransformedCategory | TransformedDataLevel1 | TransformedDataLevel2 => {
//       return 'data' in item && Array.isArray(item.data);
//     };

//     // Check for sub-categories
//     const hasSubCategories = hasData(category) && category.data?.some(subItem =>
//       subItem && (
//         (isCategoryValid(subItem) || (hasData(subItem) && subItem.data))
//       )
//     );

//     return (
//       <div
//         className={cn(
//           "w-full transition-all duration-200 ease-in-out",
//           level > 0 && "mt-2"
//         )}
//         key={uniqueId}
//       >
//         <TooltipProvider disableHoverableContent>
//           <Tooltip delayDuration={100}>
//             <TooltipTrigger asChild>
//               <Button
//                 variant="ghost"
//                 className={cn(
//                   "w-full justify-start relative group",
//                   "hover:bg-primary transition-colors",
//                   level === 0 ? "h-11 mb-1" : "h-9 mb-0.5",
//                   level > 0 && "ml-4"
//                 )}

//                 onClick={() => {
//                   if (!category.category) return;

//                   // Toggle category expansion
//                   toggleCategory(category.category);

//                   // Always set active category and update URL
//                   const uniqueId = generateUniqueId(category, index);
//                   setActiveCategory(uniqueId);
//                   handleNavigation(currentPaths);
//                 }}
//               >
//                 {isActive && (
//                   <div className="absolute left-2 top-1/2 -translate-y-1/2">
//                     <span className="relative flex h-2 w-2">
//                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
//                       <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
//                     </span>
//                   </div>
//                 )}

//                 <span className={cn(
//                   "flex items-center min-w-[24px]",
//                   isOpen === false ? "" : "mr-3",
//                   isActive && "ml-4"
//                 )}>
//                   <Icon
//                     size={level === 0 ? 18 : 16}
//                     className={cn(
//                       "text-accent-foreground",
//                       isActive && "text-primary"
//                     )}
//                   />
//                 </span>
//                 <p className={cn(
//                   "truncate font-medium max-w-[160px]",
//                   isOpen === false
//                     ? "-translate-x-96 opacity-0"
//                     : "translate-x-0 opacity-100",
//                   "transition-all duration-200 ease-in-out",
//                   level === 0 ? "text-sm" : "text-xs",
//                   isActive && "text-primary"
//                 )}>
//                   {truncateText(category.category)}
//                 </p>
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent
//               side="right"
//               className={cn(
//                 "flex flex-col gap-1.5 py-2.5 px-3",
//                 "text-sm bg-popover border border-border/50",
//                 "max-w-[300px]", // Set maximum width
//                 "rounded-md", // Make it more rectangular
//                 "shadow-md" // Add shadow for better visibility
//               )}
//             >
//               <p className="font-medium break-words">{category.category}</p>
//               <p className="text-xs text-muted-foreground whitespace-normal break-words">
//                 {category.description}
//               </p>
//             </TooltipContent>


//           </Tooltip>
//         </TooltipProvider>

//         {isExpanded && hasData(category) && category.data && (
//           <div className={cn(
//             "space-y-1",
//             isOpen !== false && level === 0 && "border-l border-border/40 ml-4 mt-2",
//             level > 0 && "mt-1"
//           )}>
//             {category.data.map((item, itemIndex) => {
//               if (!item) return null;

//               if (isCategoryValid(item) && hasData(item)) {
//                 return renderCategory(
//                   item,
//                   level + 1,
//                   currentPaths,
//                   itemIndex
//                 );
//               }

//               // Handle leaf nodes (DataLevel3)
//               if ('question' in item) {
//                 const itemUniqueId = generateUniqueId(item, itemIndex);
//                 const isItemActive = activeCategory === itemUniqueId;

//                 return (
//                   <TooltipProvider key={itemUniqueId} disableHoverableContent>
//                     <Tooltip delayDuration={100}>
//                       <TooltipTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           className={cn(
//                             "w-full justify-start relative group",
//                             "hover:bg-primary hover:text-white transition-colors",
//                             "h-8 text-xs",
//                             level > 0 ? "ml-8" : "ml-4"
//                           )}
//                           onClick={() => {
//                             setActiveCategory(itemUniqueId);
//                             // Pass both the category paths and the item ID
//                             handleNavigation(currentPaths, itemUniqueId);

//                             // Optionally scroll into view
//                             const element = document.getElementById(itemUniqueId);
//                             if (element) {
//                               element.scrollIntoView({ behavior: 'smooth' });
//                             }
//                           }}
//                           id={itemUniqueId}
//                           data-item-id={itemUniqueId}
//                         >
//                           {isItemActive && (
//                             <div className="absolute left-2 top-1/2 -translate-y-1/2">
//                               <span className="relative flex h-1.5 w-1.5">
//                                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
//                                 <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
//                               </span>
//                             </div>
//                           )}
//                           <p className={cn(
//                             "truncate pl-6 max-w-[160px]",
//                             isOpen === false
//                               ? "-translate-x-96 opacity-0"
//                               : "translate-x-0 opacity-100",
//                             isItemActive && "text-primary pl-8"
//                           )}>
//                             {truncateText(item.question || item.description)}
//                           </p>
//                         </Button>
//                       </TooltipTrigger>
//                       <TooltipContent
//                         side="right"
//                         className={cn(
//                           "text-xs py-2.5 px-3",
//                           "bg-popover border border-border/50",
//                           "max-w-[300px]", // Set maximum width
//                           "rounded-md", // Make it more rectangular
//                           "shadow-md", // Add shadow
//                           "whitespace-normal break-words" // Enable text wrapping
//                         )}
//                       >
//                         <p className="break-words">{item.question || item.description}</p>
//                       </TooltipContent>
//                     </Tooltip>
//                   </TooltipProvider>
//                 );
//               }

//               return null;
//             })}
//           </div>
//         )}
//       </div>
//     );
//   };
//   return (
//     <ScrollArea className="[&>div>div[style]]:!block">
//       <nav className="mt-8 h-full w-full">
//         <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-2 px-3">
//           {categories.map((category, index) => (
//             <li
//               className="w-full rounded-md overflow-hidden backdrop-blur-sm"
//               key={generateUniqueId(category, index)}
//             >

//               {renderCategory(category, 0, [], index)}
//             </li>
//           ))}

//           <li className="w-full grow flex items-end">
//             <TooltipProvider disableHoverableContent>
//               <Tooltip delayDuration={100}>
//                 <TooltipTrigger asChild>
//                   <Button
//                     onClick={() => { }}
//                     variant="outline"
//                     className={cn(
//                       "w-full justify-center h-9 mt-6",
//                       "text-sm border-border/50 hover:bg-destructive/90 hover:text-destructive",
//                       "transition-all duration-200 ease-in-out"
//                     )}
//                   >
//                     <span className={cn(
//                       "transition-all duration-200",
//                       isOpen === false ? "" : "mr-4"
//                     )}>
//                       <LogOut size={16} />
//                     </span>
//                     <p className={cn(
//                       "whitespace-nowrap text-sm",
//                       isOpen === false ? "opacity-0 hidden" : "opacity-100"
//                     )}>
//                       Sign out
//                     </p>
//                   </Button>
//                 </TooltipTrigger>
//                 {isOpen === false && (
//                   <TooltipContent
//                     side="right"
//                     className="bg-popover text-destructive border border-border/50"
//                   >
//                     Sign out
//                   </TooltipContent>
//                 )}
//               </Tooltip>
//             </TooltipProvider>
//           </li>
//         </ul>
//       </nav>
//     </ScrollArea>
//   );
// }



"use client";

import { Boxes, CircuitBoard, Code2, CodepenIcon, Component, Database, FileCode2, Fingerprint, Layers, LogOut, Network, Shield, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { useSidebarStore } from '@/zustand-store';
import { MenuSkeleton } from './menu-skeleton';
import { useCategories } from '@/hooks/useAllData';
import { useEffect } from "react";
import { DataLevel3, TransformedCategory, TransformedDataLevel1, TransformedDataLevel2 } from "@/types";

interface MenuProps {
  isOpen: boolean | undefined;
}

type MenuItemType = TransformedCategory | TransformedDataLevel1 | TransformedDataLevel2 | DataLevel3;

const categoryIcons = [
  Boxes, CircuitBoard, Code2, CodepenIcon, Component, Database,
  FileCode2, Fingerprint, Layers, Network, Shield, Terminal
];

const MAX_TEXT_LENGTH = 25;

const truncateText = (text: string, maxLength: number = MAX_TEXT_LENGTH) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

const hasData = (item: MenuItemType): item is TransformedCategory | TransformedDataLevel1 | TransformedDataLevel2 => {
  return 'data' in item && Array.isArray(item.data);
};

const isCategoryValid = (
  item: MenuItemType
): item is TransformedCategory | TransformedDataLevel1 | TransformedDataLevel2 => {
  return (
    'category' in item &&
    typeof (item as any).category === 'string' &&
    (item as any).category.length > 0
  );
};

const getRandomIcon = (() => {
  const iconMap = new Map<string, typeof categoryIcons[number]>();
  return (categoryName: string) => {
    if (!iconMap.has(categoryName)) {
      const randomIndex = Math.floor(Math.random() * categoryIcons.length);
      iconMap.set(categoryName, categoryIcons[randomIndex]);
    }
    return iconMap.get(categoryName)!;
  };
})();

const generateUniqueId = (
  item: MenuItemType,
  index: number
): string => {
  if ('id' in item && item.id) {
    return item.id;
  }
  if (isCategoryValid(item)) {
    return `${item.category}-${index}`;
  }
  return `item-${index}`;
};

export function Menu({ isOpen }: MenuProps) {
  const { data: categories, isLoading } = useCategories();
  const { expandedCategories, toggleCategory, activeId, setActiveId } = useSidebarStore();

  // Debug logs
  useEffect(() => {
    console.log('Current store state:', {
      expandedCategories,
      activeId,
    });
  }, [expandedCategories, activeId]);

  if (isLoading) {
    return <MenuSkeleton isOpen={isOpen} />;
  }

  if (!categories) {
    return null;
  }

  const handleCategoryClick = (category: string, uniqueId: string) => {
    console.log('Category clicked:', {
      category,
      uniqueId,
      currentExpanded: expandedCategories,
    });

    // Toggle the category expansion
    toggleCategory(category);

    // Set the active ID
    setActiveId(uniqueId);
  };

  const renderCategory = (
    category: MenuItemType,
    level = 0,
    index: number = 0
  ) => {
    // Early return if category is not valid
    if (!isCategoryValid(category)) return null;
    if (!category.category) return null;

    const uniqueId = generateUniqueId(category, index);
    const isExpanded = expandedCategories.includes(category.category);
    const Icon = getRandomIcon(category.category);
    const isActive = activeId === uniqueId;

    console.log('Rendering category:', {
      category: category.category,
      isExpanded,
      isActive,
      uniqueId
    });

    return (
      <div className={cn(
        "w-full transition-all duration-200 ease-in-out",
        level > 0 && "mt-2"
      )} key={uniqueId}>
        <TooltipProvider disableHoverableContent>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start relative group",
                  "hover:bg-primary transition-colors",
                  level === 0 ? "h-11 mb-1" : "h-9 mb-0.5",
                  level > 0 && "ml-4"
                )}
                onClick={() => {
                  if (!category.category) return;
                  handleCategoryClick(category.category, uniqueId);
                }}
              >
                {isActive && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                  </div>
                )}
                <span className={cn(
                  "flex items-center min-w-[24px]",
                  isOpen === false ? "" : "mr-3",
                  isActive && "ml-4"
                )}>
                  <Icon size={level === 0 ? 18 : 16} className={cn(
                    "text-accent-foreground",
                    isActive && "text-primary"
                  )} />
                </span>
                <p className={cn(
                  "truncate font-medium max-w-[160px]",
                  isOpen === false ? "-translate-x-96 opacity-0" : "translate-x-0 opacity-100",
                  "transition-all duration-200 ease-in-out",
                  level === 0 ? "text-sm" : "text-xs",
                  isActive && "text-primary"
                )}>
                  {truncateText(category.category)}
                </p>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className={cn(
              "flex flex-col gap-1.5 py-2.5 px-3",
              "text-sm bg-popover border border-border/50",
              "max-w-[300px]",
              "rounded-md",
              "shadow-md"
            )}>
              <p className="font-medium break-words">{category.category}</p>
              <p className="text-xs text-muted-foreground whitespace-normal break-words">
                {category.description}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {isExpanded && hasData(category) && category.data && (
          <div className={cn(
            "space-y-1",
            isOpen !== false && level === 0 && "border-l border-border/40 ml-4 mt-2",
            level > 0 && "mt-1"
          )}>
            {category.data.map((item, itemIndex) => {
              if (!item) return null;

              if (isCategoryValid(item) && hasData(item)) {
                return renderCategory(
                  item,
                  level + 1,
                  itemIndex
                );
              }

              // Handle leaf nodes (DataLevel3)
              if ('question' in item) {
                const itemUniqueId = generateUniqueId(item, itemIndex);
                const isItemActive = activeId === itemUniqueId;

                return (
                  <TooltipProvider key={itemUniqueId} disableHoverableContent>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start relative group",
                            "hover:bg-primary hover:text-white transition-colors",
                            "h-8 text-xs",
                            level > 0 ? "ml-8" : "ml-4"
                          )}
                          onClick={() => {
                            setActiveId(itemUniqueId);
                            const element = document.getElementById(itemUniqueId);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          id={itemUniqueId}
                          data-item-id={itemUniqueId}
                        >
                          {isItemActive && (
                            <div className="absolute left-2 top-1/2 -translate-y-1/2">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                              </span>
                            </div>
                          )}
                          <p className={cn(
                            "truncate pl-6 max-w-[160px]",
                            isOpen === false ? "-translate-x-96 opacity-0" : "translate-x-0 opacity-100",
                            isItemActive && "text-primary pl-8"
                          )}>
                            {truncateText(item.question || item.description)}
                          </p>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className={cn(
                          "text-xs py-2.5 px-3",
                          "bg-popover border border-border/50",
                          "max-w-[300px]",
                          "rounded-md",
                          "shadow-md",
                          "whitespace-normal break-words"
                        )}
                      >
                        <p className="break-words">{item.question || item.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    );
  };
  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="mt-8 h-full w-full">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-2 px-3">
          {categories.map((category, index) => (
            <li
              className="w-full rounded-md overflow-hidden backdrop-blur-sm"
              key={generateUniqueId(category, index)}
            >
              {renderCategory(category, 0, index)}
            </li>
          ))}
          <li className="w-full grow flex items-end">
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => { }}
                    variant="outline"
                    className={cn(
                      "w-full justify-center h-9 mt-6",
                      "text-sm border-border/50 hover:bg-destructive/90 hover:text-destructive",
                      "transition-all duration-200 ease-in-out"
                    )}
                  >
                    <span className={cn(
                      "transition-all duration-200",
                      isOpen === false ? "" : "mr-4"
                    )}>
                      <LogOut size={16} />
                    </span>
                    <p className={cn(
                      "whitespace-nowrap text-sm",
                      isOpen === false ? "opacity-0 hidden" : "opacity-100"
                    )}>
                      Sign out
                    </p>
                  </Button>
                </TooltipTrigger>
                {isOpen === false && (
                  <TooltipContent
                    side="right"
                    className="bg-popover text-destructive border border-border/50"
                  >
                    Sign out
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </nav>
    </ScrollArea>
  );
}