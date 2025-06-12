import { create } from "zustand"

interface StoreState {
  id: string
  setId: (newId: string) => void
}

export const useStore = create<StoreState>((set) => ({
  id: "",
  setId: (newId: string) =>
    set(() => ({
      id: newId,
    })),
}))
