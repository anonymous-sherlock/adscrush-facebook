import { create } from "zustand";

type AadaarImagesStore = {
  images: File[]
  setImages: (newImages: File | File[]) => void;
  removeImage: (file: File) => void;
  removeAll: () => void
};

export const useAadhaarImages = create<AadaarImagesStore>((set) => ({
  images: [],
  setImages: (newImages) => set((state) => {
    const updatedImages = Array.isArray(newImages) ? [...newImages, ...state.images] : [newImages, ...state.images];
    return { images: updatedImages };
  }),
  removeImage: (fileToRemove) =>
    set((state) => {
      const updatedImages = state.images.filter((file) => file !== fileToRemove);

      return { images: updatedImages };
    }),
  removeAll: () => set(() => {

    return ({ images: [] })
  })
}));