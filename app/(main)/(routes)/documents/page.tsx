"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { PlusCircle, Trash } from "lucide-react";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";


const DocumentsPage = () => {
  const { user } = useUser();
  const create = useMutation(api.documents.create);

  function onCreate() {
    const promise = create({ title: "Untitled" });
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  }
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image src={"/images/empty.png"} height={300} width={300} alt="Empty" className="dark:hidden" />
      <Image src={"/images/empty-dark.png"} height={300} width={300} alt="Empty" className="hidden dark:block mr-8" />

      <h2 className="text-lg font-medium">Welcome to {user?.firstName}&apos;s Jotion</h2>
      <Button className="text-sm" onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>
    </div>
  );
};

export default DocumentsPage;
