import { create } from "zustand"

interface StoreState {
  id: string
  avatarUrl: string | null
  setId: (newId: string) => void
  setAvatarUrl: (newUrl: string | null) => void
}

export const useStore = create<StoreState>((set) => ({
  id: "",
  avatarUrl: null,
  setId: (newId: string) =>
    set(() => ({
      id: newId,
    })),
  setAvatarUrl: (newUrl: string | null) =>
    set(() => ({
      avatarUrl: newUrl,
    })),
}))
