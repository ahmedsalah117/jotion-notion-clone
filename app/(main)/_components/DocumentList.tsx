"use client"
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';

import { useQuery } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import Item from './Item';
import { cn } from '@/lib/utils';
import { FileIcon } from 'lucide-react';


interface DocumentListProps {
  parentDocumentId?: Id<"documents">;
  level?: number;
  data?: Doc<"documents">;
}

const DocumentList = ({ parentDocumentId, level = 0, data }: DocumentListProps) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})  

  const onExpand = (documentId: string) => {
    setExpanded(prev => ({
      ...prev,
      [documentId]: !prev[documentId],
    }))
  }

  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentId,
  })

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  }

  // convex guarantees that documents will only undefined while loading. and yes even if the request fails, it won't be undefined. 
  if (documents === undefined) {
    return (
      <>
      
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
            </>
        )}
      </>
    )
  }
  return (
    <>
      <p style={{ paddingLeft: level ? `${level * 12 + 25}px` : "12px" }} className={cn("hidden text-sm font-medium pt-1 text-muted-foreground/80", expanded && "last:block", level === 0 && "hidden")}>
        No page inside
      </p>
      {documents.map((document) => {
        return (
          <div key={document._id}>
            <Item
              id={document._id}
              onClick={() => onRedirect(document._id)}
              label={document.title}
              icon={FileIcon}
              documentIcon={document.icon}
              active={params?.documentId === document?._id}
              level={level}
              onExpand={() => onExpand(document._id)}
              expanded={expanded[document._id]}
            />
            {/* if the current doc is expanded , then render the DocumentList component recursively until we reach the end of the tree*/}
            {expanded[document._id] && <DocumentList parentDocumentId={document._id} level={level + 1} />}
          </div>
        );
      })}
    </>
  );
}

export default DocumentList