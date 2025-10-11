"use client"
import { useSearch } from '@/hooks/use-search'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, } from "@/components/ui/command";
import { useQuery } from 'convex/react';
import React, { useEffect , useState} from 'react'
import { useRouter } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/clerk-react';
import { File } from 'lucide-react';
const SearchCommand = () => {
  const {user} = useUser()

  const router = useRouter()
  const documents = useQuery(api.documents.getSearch)
  const [isMounted, setIsMounted] = useState(false)
  const toggle = useSearch((store)=>store.onToggle)
  const onClose = useSearch((store)=>store.onClose)
  const onOpen = useSearch((store) => store.onOpen)
  const isOpen = useSearch((store) => store.isOpen)

  // this is to prevent the hydration errors.
  useEffect(()=>{
    setIsMounted(true)
  },[])

  // toggles the Search dialog on/off when the user presses the k key + command/ctrl key
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if(e.key === "k" && (e.metaKey || e.ctrlKey)){
        e.preventDefault()
        toggle()
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)

  },[toggle])

  const onSelect = (id: string) => {
  router.push(`/documents/${id}`)
  onClose()
}

  if(!isMounted){
    return null
  }
  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>

      <CommandInput placeholder={`Search ${user?.fullName}'s Jotion...`} />
      <CommandEmpty>
        No results found!

      </CommandEmpty>

      <CommandGroup heading="Documents">

        {documents?.map(document => {
          return (
            <CommandItem className='cursor-pointer' key={document._id} value={`${document._id}-${document.title}`} title={document.title} onSelect={onSelect}>
              {document.icon ? <p className="mr-2 text-[18px]">{document.icon}</p> : <File className="mr-2 h-4 w-4" />}

              <span>{document.title}</span>
            </CommandItem>
          );
        })}

      </CommandGroup>
    </CommandDialog>
  )
}

export default SearchCommand