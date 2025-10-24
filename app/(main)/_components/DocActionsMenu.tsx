"use client"
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';


  interface DocActionsMenuProps {
    documentId: Id<"documents">;
  }
const DocActionsMenu = ({ documentId }: DocActionsMenuProps) => {
  const router = useRouter();
  const { user } = useUser();
  const archiveDoc = useMutation(api.documents.archive)

  const onArchive = () => {
    const promise = archiveDoc({ id: documentId })
    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to move note to trash.",
    })
    router.push("/documents")
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align='end' alignOffset={8} forceMount>


        <DropdownMenuItem onClick={onArchive}>
          
<Trash className='h-4 w-4 mr-2' />

Delete
</DropdownMenuItem>
<DropdownMenuSeparator />


        <div className='text-xs text-muted-foreground p-2'>
          Last editedby: {user?.fullName}
</div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DocActionsMenu


DocActionsMenu.Skeleton = function DocActionsMenuSkeleton() {
  return (
    <Skeleton className='h-10 w-10' />
  )
}