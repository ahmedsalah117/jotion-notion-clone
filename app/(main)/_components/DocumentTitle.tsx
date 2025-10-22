"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { EditDocumentContext } from '@/contexts/editDocumentContext'
import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'
import { Title } from '@radix-ui/react-dialog'
import { useMutation } from 'convex/react'
import { HtmlContext } from 'next/dist/server/route-modules/pages/vendored/contexts/entrypoints'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

const DocumentTitle = ({ initialData }: { initialData: Doc<"documents"> }) => {
  const inputRef = useRef<HTMLInputElement>(null)
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const update = useMutation(api.documents.updateDocument)
  const { setLocalDocTitle , localDocTitle, isEditing, setIsEditing} = useContext(EditDocumentContext);
  const enableInput = () => {
    setLocalDocTitle(initialData?.title)
    setIsEditing(true)
//     setTimeout(() => {...}, 0) defers the execution to the next event loop tick, which happens after React completes the re-render. This ensures:
// ✅ The <Input> component is mounted in the DOM
// ✅ inputRef.current points to the actual input element
    // ✅ You can safely call focus() and setSelectionRange()
    // you can replace the setTimeout with useEffect that tracks the isEditing state and focuses the input when it is true.
    setTimeout(() => {
      inputRef.current?.focus()
      // this method selects a text in an input field (native dom method) and it takes the start and end index of the text to select.
      inputRef.current?.setSelectionRange(0, inputRef.current?.value?.length || 0)
    }, 0)
  }

  const disableInput = () => {
    setIsEditing(false)
  }


  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalDocTitle(event?.target?.value);

    // antonio's implementation which calls the update api handler on each key stroke, but I do not agree with it because it will call the api handler many times on each key stroke. I replaced it with the optimistic UI updates using a context to make sure it reflects everywhere. even though all convex queries and mutations are send/received through an open websocket, meaning that there are no dozens of REST requests being sent to the server, but still each time the update api handler is called, we authenticate the user, fetch the document, write an update to the DB and so on.
    // update({
    //   id:initialData?._id
    //   ,
    //   title: event?.target?.value || "Untitled"
    // })

  }
  

  const onKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // I will only call the update api handler when the user presses the enter key. (after finishing the typing)
      try {
        await  update({
            id:initialData?._id
            ,
            title: localDocTitle ?? "Untitled"
        })
        disableInput();
        
      } catch (error) {
        toast.error("Failed to update the document title!", {
          description: "Please try again.",
        });
      }
      
    }
  }
  
  return (
    <div className='flex items-center gap-x-1'>
      {
        !!initialData.icon
        &&
        <p>
      {initialData.icon}
      </p>
      }

      {isEditing ? <>
      <Input ref={inputRef} value={localDocTitle} onChange={onChange} onKeyDown={onKeyDown} className='h-7 px-2 focus-visible:ring-transparent'/>
      </> : <Button onClick={() => {enableInput()}}

          variant='ghost'
          size='sm'
          className='font-normal h-auto p-1'>
          <span className='truncate'>
                {initialData.title}
        </span>
      </Button>}

    </div>
  )
}

export default DocumentTitle



DocumentTitle.Skeleton = function TitleSkeleton() {
  return (
    <Skeleton className='h-6 w-20 rounded-md' />
  )
}