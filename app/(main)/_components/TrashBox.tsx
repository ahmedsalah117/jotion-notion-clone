"use client"
import React, { use, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {useQuery, useMutation} from 'convex/react'
import {api} from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { toast } from 'sonner'
import Spinner from '@/components/spinner'
import { SearchIcon, Trash, Undo } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ConfirmModal } from '@/components/modals/confirm-modal'

const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const documents = useQuery(api.documents.getTrashItems);
  const restore = useMutation(api.documents.restoreFromTrash);
  const deletePermenantly = useMutation(api.documents.deleteDocPermanently);
  const [search, setSearch] = useState("")
  const [filteredDocuments, setFilteredDocuments] = useState(documents)

  useEffect(() => {
    const filtered = documents?.filter((document) => {
      return document.title.toLowerCase().includes(search.toLowerCase());
    })
    setFilteredDocuments(filtered);
  }, [search, documents]);


  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`)
  }

  const onRestore = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, documentId: Id<"documents">) => { 
    event.stopPropagation();
    const promise = restore ({id: documentId})
    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored!",
      error: "Failed to restore note.",
    })
  }

    const onDelete = ( documentId: Id<"documents">) => {
      
      const promise = deletePermenantly({ id: documentId });
      toast.promise(promise, {
        loading: "Deleting note...",
        success: "Note deleted!",
        error: "Failed to delete note.",
      });

      if(params.documentId === documentId){
        router.push("/documents")
      }
    };
  
  // while loading the documents, we are showing a spinner
  if (documents === undefined) {
    return (
      <div className='h-full flex items-center justify-center p-4'>
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className='text-sm'>
      <div className='flex items-center gap-x-1 p-2'>
        <SearchIcon className='h-4 w-4'/>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} className='h-7 px-2 focus-visible:ring-transparent bg-secondary'
        placeholder='filter by page title...'
        />
        
      </div>
      
      <div className='mt-2 px-1 pb-1'>
        <p className='hidden last:block text-xs text-center text-muted-foreground pb-2'>
          
          No documents found.
        </p>

        {filteredDocuments?.map(document => {
          return (
            <div key={document._id} role="button" onClick={() => {
              onClick(document._id)
            }}
            className='text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between'
            >

              <span className='truncate pl-2'>
                {document.title}
              </span>

              <div className='flex items-center'>

                <div onClick={(e) => onRestore(e, document._id)}
                  role="button"
                  className='rounded-sm p-2 hover:bg-neutral-200'
                >

                  <Undo className='h-4 w-4 cursor-pointer text-muted-foreground'/>
                </div>
                <ConfirmModal onConfirm={() => onDelete(document._id)}>

                <div role="button" className='rounded-sm p-2 hover:bg-neutral-200'>

                  <Trash className='h-4 w-4 text-muted-foreground cursor-pointer'/>
                </div>
                </ConfirmModal>

              </div>


            </div>
          )
        })}

      </div>
      
    </div>
  )
}

export default TrashBox