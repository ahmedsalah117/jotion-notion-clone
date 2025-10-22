"use client"
import React from 'react'
import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { MenuIcon } from 'lucide-react';
import DocumentTitle from './DocumentTitle';


interface DocNavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}
const DocumentNavbar = ({ isCollapsed, onResetWidth }: DocNavbarProps) => {
  const params = useParams()

  const document = useQuery(api.documents.getDocById, {
    documentId: params.documentId as Id<"documents">,
  })

  if (document === undefined) {
    return <nav className="bg-background dark:bg-[#1F1F1F] p-3 py-2 w-full flex items-center">
      <DocumentTitle.Skeleton />
    </nav>;
  }

  if (document === null) {
    return <div>Document not found</div>
  }
  return (
    <div className='bg-background dark:bg-[#1F1F1F] p-3 py-2 w-full flex items-center gap-x-4'>
      {isCollapsed && (
        <MenuIcon role="button" onClick={onResetWidth} className='h-6 w-6 text-muted-foreground' />
      )}

      <div className='flex items-center justify-between w-full'>
        <DocumentTitle initialData={document} />
      </div>
    </div>
  )
}

export default DocumentNavbar