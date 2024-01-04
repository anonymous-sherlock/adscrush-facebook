import { env } from "@/env.mjs";
import { UTApi } from "uploadthing/server";
export const utapi = new UTApi({
    apiKey: env.UPLOADTHING_SECRET
    
});
