import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { ChevronDown, ChevronRight, Command, LucideIcon, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

interface ItemProps {
  id?: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick: () => void;
  icon: LucideIcon;
}

const Item = ({ icon: Icon, label, onClick, id, documentIcon, active, expanded, isSearch, level = 0, onExpand }: ItemProps) => {
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;
  const router = useRouter();
  const create = useMutation(api.documents.create);
  const handleExpand = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onExpand?.();
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClick();
  };

  const onCreate = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!id) return;
    const promise = create({ title: "Untitled", parentDocument: id }).then((docId) => {
      if (!expanded) {
        onExpand?.();
      }
      // router.push(`/documents/${docId}`);
    });
    toast.promise(promise, {
      loading: "Creating a new page...",
      success: "New page created!",
      error: "Failed to create a new page.",
    });
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn("group cursor-pointer min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium", active && "bg-primary/5 text-primary")}
    >
      {!!id && (
        <div role="button" className="h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1" onClick={handleExpand}>
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div> : <Icon className="h-[18px] mr-2 shrink-0 text-muted-foreground" />}

      <span className="truncate">{label}</span>

      {isSearch && (
        <kbd className="ml-auto pointer-events-none opacity-100 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-lg">⌘ </span>
          <span className="text-base">k</span>
        </kbd>
      )}
      {id && (
        <div className="ml-auto flex items-center gap-x-2">
          <div className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600" onClick={onCreate} role="button">
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Item;

Item.Skeleton = function ItemSkeleton({ level }: { level: number }) {
  return (
    <div style={{ paddingLeft: level ? `${level * 12 + 25}px` : "12px" }} className="flex gap-x-2 py-[3px]">
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};
