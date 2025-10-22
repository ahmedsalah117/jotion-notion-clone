"use client"
import { Doc } from "@/convex/_generated/dataModel";
import { createContext, useState } from "react";

interface ContextProps{
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  document: Doc<"documents"> | null;
  setDocument: (document: Doc<"documents"> | null) => void;
  localDocTitle: string;
  setLocalDocTitle: (localDocTitle: string) => void;
}

export const EditDocumentContext = createContext<ContextProps>({ isEditing: false, setIsEditing: () => {}, document: null, setDocument: () => {}, localDocTitle: "", setLocalDocTitle: () => {} })


export const EditDocumentProvider = ({ children }: { children: React.ReactNode }) => {
  
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [document, setDocument] = useState<Doc<"documents"> | null>(null)
  const [localDocTitle, setLocalDocTitle] = useState<string>("Untitled")
  const value = {
    isEditing,
    setIsEditing,
    document,
    setDocument,
    localDocTitle,
    setLocalDocTitle,
  };
  return <EditDocumentContext.Provider value={value}>{children}</EditDocumentContext.Provider>;
}