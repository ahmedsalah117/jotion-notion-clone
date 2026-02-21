"use client"
import DocumentToolbar from "@/app/(main)/_components/DocumentToolbar";
import DocumentCover from "@/components/Document-Cover";

import { Skeleton } from "@/components/ui/skeleton";
import { EditDocumentContext } from "@/contexts/editDocumentContext";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";


const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });
const DocumentDetailsPage = () => {
  // const Editor = useMemo(() => dynamic(() => import("@/components/Editor"), { ssr: false }), []);

  const params = useParams();

  const document = useQuery(api.documents.getDocById, {
    documentId: params.documentId as Id<"documents">,
  });
  const updateDoc = useMutation(api.documents.updateDocument);
  const { setDocument, setLocalDocTitle } = useContext(EditDocumentContext);

  const onChange = (content: string) => {
    updateDoc({
      id: params.documentId as Id<"documents">,
      content,
    });
  };
  // Creating an identical local state of the document so that we can use it while updating the doucment without writing too many times to the DB. We will only write on save.
  useEffect(() => {
    if (document) {
      setDocument(document);
      setLocalDocTitle(document?.title || "Untitled");
    }
  }, [document]);

  if (document === undefined) {
    return (
      <div>
        <DocumentCover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }
  if (document === null) {
    return <div>Document not found</div>;
  }

  return (
    <div className="pb-48">
      <DocumentCover url={document?.coverImage} />

      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <DocumentToolbar initialData={document} />
        <Editor onChange={onChange} initialContent={document?.content} />
      </div>
    </div>
  );
};

export default DocumentDetailsPage