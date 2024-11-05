

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
import romans from "romans";
import { generateItemId } from "@/lib/id-generators";

interface MenuProps {
  isOpen: boolean | undefined;
}

type MenuItemType = TransformedCategory | TransformedDataLevel1 | TransformedDataLevel2 | DataLevel3;

const categoryIcons = [
  Boxes, CircuitBoard, Code2, CodepenIcon, Component, Database,
  FileCode2, Fingerprint, Layers, Network, Shield, Terminal
];

const MAX_TEXT_LENGTH = 25;

const getAlphabetLabel = (num: number): string => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (num < 26) return alphabet[num];
  const first = Math.floor(num / 26) - 1;
  const second = num % 26;
  return `${alphabet[first]}${alphabet[second]}`;
};

const getLevelIndicator = (level: number, index: number): string => {
  switch (level) {
    case 0:
      return romans.romanize(index + 1);
    case 1:
      return getAlphabetLabel(index);
    case 2:
      return (index + 1).toString();
    default:
      return (index + 1).toString();
  }
};
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

// const generateUniqueId = (
//   item: MenuItemType,
//   index: number,
//   level: number = 0
// ): string => {
//   const levelIndicator = getLevelIndicator(level, index);

//   if ('id' in item && item.id) {
//     return `${levelIndicator}-${item.id}`;
//   }

//   if (isCategoryValid(item)) {
//     return `${levelIndicator}-${item.category}-${index}`;
//   }

//   return `${levelIndicator}-item-${index}`;
// };

export function Menu({ isOpen }: MenuProps) {
  const { data: categories, isLoading } = useCategories();
  const { expandedCategories, toggleCategory, activeId, setActiveId } = useSidebarStore();

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
    toggleCategory(category);
    setActiveId(uniqueId);
    window.location.hash = uniqueId;
  }

  const renderCategory = (
    category: MenuItemType,
    level = 0,
    index: number = 0
  ) => {
    if (!isCategoryValid(category) || !category.category) return null;

    const uniqueId = generateItemId(level, index, category.id);
    const levelIndicator = getLevelIndicator(level, index);
    const isExpanded = expandedCategories.includes(category.category);
    const Icon = getRandomIcon(category.category);
    const isActive = activeId === category.id;
    console.log("this is the categey id in menu:", category.id);
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
                  handleCategoryClick(category.category, category.id);
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
                  {level === 0 ? (
                    <div className="min-w-[24px] flex items-center justify-center">
                      <span className="text-xs font-medium">{levelIndicator}</span>
                    </div>
                  ) : (
                    <Icon
                      size={level === 0 ? 18 : 16}
                      className={cn(
                        "text-accent-foreground",
                        isActive && "text-primary"
                      )}
                    />
                  )}
                </span>
                <p className={cn(
                  "truncate font-medium max-w-[160px]",
                  isOpen === false ? "-translate-x-96 opacity-0" : "translate-x-0 opacity-100",
                  "transition-all duration-200 ease-in-out",
                  level === 0 ? "text-sm" : "text-xs",
                  isActive && "text-primary"
                )}>
                  {`${level > 0 ? `${levelIndicator}. ` : ''}${truncateText(category.category)}`}
                </p>
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className={cn(
                "flex flex-col gap-1.5 py-2.5 px-3",
                "text-sm bg-popover border border-border/50",
                "max-w-[300px]",
                "rounded-md",
                "shadow-md"
              )}
            >
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
                return renderCategory(item, level + 1, itemIndex);
              }

              // Handle leaf nodes (DataLevel3)
              if ('question' in item) {
                const itemUniqueId = generateItemId(level + 1, itemIndex, item.id);
                console.log("itemUniqueId:", itemUniqueId);
                console.log("this is the item id in menu:", item.id);
                const isItemActive = activeId === item.id;

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
                            setActiveId(item.id);
                            window.location.hash = item.id;
                          }}

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
                            {`${getLevelIndicator(level + 1, itemIndex)}. ${truncateText(item.question || item.description)}`}
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
              key={generateItemId(2, index, category.id)}
            >
              {renderCategory(category, 0, index)}
            </li>
          ))}

          {/* Sign Out Button */}
          <li className="w-full grow flex items-end">
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      // Add your sign out logic here
                    }}
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