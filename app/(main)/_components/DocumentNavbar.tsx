"use client"
import React from 'react'
import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { MenuIcon } from 'lucide-react';
import DocumentTitle from './DocumentTitle';
import DocumentBanner from "./DocumentBanner";
import DocActionsMenu from "./DocActionsMenu";

interface DocNavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}
const DocumentNavbar = ({ isCollapsed, onResetWidth }: DocNavbarProps) => {
  const params = useParams();

  const document = useQuery(api.documents.getDocById, {
    documentId: params.documentId as Id<"documents">,
  });

  if (document === undefined) {
    return (
      <nav className="bg-background dark:bg-[#1F1F1F] p-3 py-2 w-full flex items-center justify-between">
        <DocumentTitle.Skeleton />
        <div className="flex items-center gap-x-2">
          <DocActionsMenu.Skeleton />
        </div>
      </nav>
    );
  }

  if (document === null) {
    return <div>Document not found</div>;
  }
  return (
    <>
      <nav className="bg-background dark:bg-[#1F1F1F] p-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && <MenuIcon role="button" onClick={onResetWidth} className="h-6 w-6 text-muted-foreground" />}

        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between w-full">
            <DocumentTitle initialData={document} />
            <div className="flex items-center gap-x-2">
              <DocActionsMenu documentId={document._id} />
            </div>
          </div>

          {document.isArchived && <DocumentBanner documentId={document._id} />}
        </div>
      </nav>
    </>
  );
};

export default DocumentNavbar