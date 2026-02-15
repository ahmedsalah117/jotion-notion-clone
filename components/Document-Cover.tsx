import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react'
import { Button } from './ui/button';
import { ImageIcon, X } from 'lucide-react';
import { useCoverImage } from '@/hooks/use-cover-image';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { Id } from '@/convex/_generated/dataModel';



interface CoverImageProps{
  url?: string;
  preview?: boolean;
}
const DocumentCover = ({url, preview}: CoverImageProps) => {
  const params = useParams()
  const coverImage = useCoverImage()
  const removeCover = useMutation(api.documents.removeDocCover)
  const removeCoverImage = () => {
    removeCover({id: params.documentId as Id<"documents">})
  }
  return (
    <div className={cn("relative w-full h-[35vh] group", !url && "h-[12vh]", url && "bg-muted")}>
      {
        !!url && <Image src={url} alt="Document Cover" fill className='object-cover' />
      
      }
      {url && !preview && (
        <div className='opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 items-center gap-x-2 flex'>
          <Button onClick={coverImage.onOpen} className='text-muted-foreground text-xs' variant={"outline"} size={"sm"}>
            <ImageIcon className='h-4 w-4 mr-2'/>
            Change cover
          </Button>
          <Button onClick={removeCoverImage} className='text-muted-foreground text-xs' variant={"outline"} size={"sm"}>
            <X className='h-4 w-4 mr-2'/>
            
            Remove cover
          </Button>
          </div>
      )}
    </div>
  )
}

export default DocumentCover