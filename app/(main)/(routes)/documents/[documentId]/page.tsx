"use client"
import { EditDocumentContext } from '@/contexts/editDocumentContext'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { useParams } from 'next/navigation'
import React, { useContext, useEffect } from 'react'

const DocumentDetailsPage = () => {
  const params = useParams()
  const document = useQuery(api.documents.getDocById, {
    documentId: params.documentId as Id<"documents">,
  })

    const { setDocument } = useContext(EditDocumentContext);

  useEffect(() => {
    if (document) {
      setDocument(document);
    }
  }, [document]);
  return (
    <div>DocumentDetailsPage</div>
  )
}

export default DocumentDetailsPage