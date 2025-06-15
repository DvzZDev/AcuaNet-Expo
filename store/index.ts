import { create } from "zustand"

interface StoreState {
  id: string
  avatarUrl: string | null
  dirtyFavs: boolean
  setId: (newId: string) => void
  setAvatarUrl: (newUrl: string | null) => void
  setDirtyFavs: (dirty: boolean) => void
}

export const useStore = create<StoreState>((set) => ({
  id: "",
  avatarUrl: null,
  dirtyFavs: false,
  setId: (newId: string) =>
    set(() => ({
      id: newId,
    })),
  setAvatarUrl: (newUrl: string | null) =>
    set(() => ({
      avatarUrl: newUrl,
    })),
  setDirtyFavs: (dirty: boolean) =>
    set(() => ({
      dirtyFavs: dirty,
    })),
}))
