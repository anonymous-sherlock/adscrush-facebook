import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";



const f = createUploadthing();

export const ourFileRouter = {
  aadharUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 1 },
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const user = await getCurrentUser();


      if (!user || !user.id) throw new Error("You must be logged in to upload a file");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Uploaded by user", metadata.userId);
      const createdFile = await db.document.create({
        data: {
          key: file.key,
          documentType: file.url,
          name: file.name,
          userId: metadata.userId,
          url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
        },
      });

    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
