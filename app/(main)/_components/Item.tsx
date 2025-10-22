import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

import { useMutation } from "convex/react";
import { ChevronDown, ChevronRight, Command, LucideIcon, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import { EditDocumentContext } from "@/contexts/editDocumentContext";

interface ItemProps {
  id?: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick?: () => void;
  icon: LucideIcon;
  containerClassName?: string;
}

const Item = ({ icon: Icon, label, onClick, id, documentIcon, active, expanded, isSearch, level = 0, onExpand, containerClassName }: ItemProps) => {
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;
  const { document, isEditing, localDocTitle } = useContext(EditDocumentContext);
  const router = useRouter();
  const { user } = useUser();
  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archive);
  const handleExpand = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onExpand?.();
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClick?.();
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

  const onArchive = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!id) return;
    const promise = archive({ id });
    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to move note to trash.",
    });
  };
  return (
    <div
      onClick={handleClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn(
        "group cursor-pointer min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary",
        containerClassName,
      )}
    >
      {!!id && (
        <div role="button" className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1" onClick={handleExpand}>
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div> : <Icon className="h-[18px] mr-2 shrink-0 text-muted-foreground" />}
      {/* if the user is updating the document title, we use optimistic update to avoid calling the api handler many times on each key stroke */}
      <span className="truncate">{isEditing && id === document?._id ? localDocTitle : label}</span>

      {isSearch && (
        <kbd className="ml-auto pointer-events-none opacity-100 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-lg">⌘ </span>
          <span className="text-base">k</span>
        </kbd>
      )}
      {id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
              <div role="button" className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60" align="start" side="right" forceMount>
              <DropdownMenuItem onClick={onArchive} className="cursor-pointer">
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">Last edited by: {user?.fullName}</div>
            </DropdownMenuContent>
          </DropdownMenu>

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
