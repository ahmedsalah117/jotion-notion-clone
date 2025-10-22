import { v } from "convex/values";
import { ActionCtx, mutation, query, QueryCtx } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { runInContext } from "vm";

async function checkIdentityHandler(ctx: ActionCtx | QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized");
  }
  return identity;
}

export const archive = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Document not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Not authorized to archive this document!");
    }

    const recursiveArchive = async (parentDocumentId: Id<"documents">) => {
      const childDocs = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) => {
          return q.eq("userId", userId).eq("parentDocument", parentDocumentId);
        })
        .collect();

      //we are using a for of loop instead of a map method so that we can use promises within the loop.

      // looping over the direct children of the parent document, and making them archived, and then recursively looping over the children of the direct child so that we can archive them as well. This means that whenever we archive a doc, all of its direct children and their children will be archived as well.
      for (const child of childDocs) {
        await ctx.db.patch(child._id, { isArchived: true });
        await recursiveArchive(child._id);
      }
    };

    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    });

    await recursiveArchive(args.id);

    return document;
  },
});

//This handler fetches all documents with respect to the parent child relationship.
export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) => q.eq("userId", userId).eq("parentDocument", args.parentDocument))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.subject;

    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });

    return document;
  },
});

export const getTrashItems = query({
  handler: async (ctx: QueryCtx) => {
    const identity = await checkIdentityHandler(ctx);

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();

    return documents;
  },
});

export const restoreFromTrash = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await checkIdentityHandler(ctx);

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Document not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Not authorized to restore this document!");
    }

    const recursiveRestore = async (parentDocId: Id<"documents">) => {
      const childDocs = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) => {
          return q.eq("userId", userId).eq("parentDocument", parentDocId);
        })
        .collect();

      for (const child of childDocs) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        });
        await recursiveRestore(child._id);
      }
    };

    const options: Partial<Doc<"documents">> = {
      isArchived: false,
    };

    // If the document being restored has a parent that is still archived,
    // remove the parent relationship to prevent inconsistent state where
    // a child document is restored but its parent remains in trash.
    // This makes the document accessible at the root level instead.
    if (existingDocument.parentDocument) {
      const parent = await ctx.db.get(existingDocument.parentDocument);

      if (parent?.isArchived) {
        options.parentDocument = undefined;
      }
    }

    const document = await ctx.db.patch(args.id, options);

    await recursiveRestore(args.id);

    return document;
  },
});

export const deleteDocPermanently = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await checkIdentityHandler(ctx);

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Document not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Not authorized to delete this document!");
    }

    const document = await ctx.db.delete(args.id);

    return document;
  },
});

// this fetches all unarchived documents for the logged in user, disregarding the parent child relationship.
export const getSearch = query({
  handler: async (ctx) => {
    const identity = await checkIdentityHandler(ctx);
    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  },
});

export const getDocById = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    const document = await ctx.db.get(args.documentId);

    if (!document) {
      throw new Error("Not found");
    }
    // if the doc is published, return it to non-logged in users.
    if (!document.isArchived && document.isPublished) {
      return document;
    }

    if (!identity) {
      throw new Error("Un authenticated");
    }
    // if the doc is not published , it can only be accessed by its author.

    if (userId !== document.userId) {
      throw new Error("Un authorized to view this document.");
    }

    return document;
  },
});


export const updateDocument = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string())
    ,
    icon: v.optional(v.string())
    ,
    isPublished: v.optional(v.boolean())

  },
  handler: async (ctx, args) => {
    const identity = await checkIdentityHandler(ctx);
    const userId = identity.subject;

    const { id, ...rest } = args;
    
    const existingDocument = await ctx.db.get(id);

    if(!existingDocument) {
      throw new Error("Document not found");
    }

    if(existingDocument.userId !== userId) {
      throw new Error("Not authorized to update this document!");
    }

 await ctx.db.patch(id, rest);

  }
})