"use client"
import DocumentToolbar from "@/app/(main)/_components/DocumentToolbar";
import { EditDocumentContext } from "@/contexts/editDocumentContext";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React, { useContext, useEffect } from "react";

const DocumentDetailsPage = () => {
  const params = useParams();

  const document = useQuery(api.documents.getDocById, {
    documentId: params.documentId as Id<"documents">,
  });

  const { setDocument, setLocalDocTitle } = useContext(EditDocumentContext);

  // Creating an identical local state of the document so that we can use it while updating the doucment without writing too many times to the DB. We will only write on save.
  useEffect(() => {
    if (document) {
      setDocument(document);
      setLocalDocTitle(document?.title || "Untitled");
    }
  }, [document]);

  if (document === undefined) {
    return <div>Loading...</div>;
  }
  if (document === null) {
    return <div>Document not found</div>;
  }

  return (
    <div className="pb-48">
      <div className="h-[35vh]" />

      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <DocumentToolbar initialData={document} />
      </div>
    </div>
  );
};

export default DocumentDetailsPage