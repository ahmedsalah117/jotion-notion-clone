import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';


interface DocumentBannerProps {
  documentId: Id<"documents">;
}


const DocumentBanner = ({ documentId }: DocumentBannerProps) => {
  const router = useRouter()
  const deleteDoc = useMutation(api.documents.deleteDocPermanently)
  const restoreDoc = useMutation(api.documents.restoreFromTrash)


  const onDelete = () => {
    const promise = deleteDoc({id:documentId})
    toast.promise(promise, {
      loading: "Deleting note...",
      success: "Note deleted!",
      error: "Failed to delete note.",
    })
    router.push("/documents")
  }
  const onRestore = () => {
    const promise = restoreDoc({id:documentId})
    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored!",
      error: "Failed to restore note.",
    })
    router.push("/documents")
  }

  return (
    <div className='w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center'>
      <p>
        This page is in the trash.
      </p>
      <Button className='border-white bg-transparent hover:bg-primary/5 text-white hover:text-white' variant="outline" size="sm" onClick={onRestore}>
        Restore page
      </Button>
      <ConfirmModal onConfirm={onDelete}>

      <Button variant="outline" size="sm" className='border-white bg-transparent hover:bg-primary/5 text-white hover:text-white'>
        Delete forever
      </Button>
      </ConfirmModal>
    </div>
  )
}

export default DocumentBanner