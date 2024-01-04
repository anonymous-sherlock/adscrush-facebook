"use server";

import { utapi } from "@/server/uploadthing";

export async function aadharUploader(file: unknown) {
  try {
    const response = await utapi.uploadFiles(file);
    if (response.error) {
      return {
        error: response.error
      }
    }

    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    return null
  }
}