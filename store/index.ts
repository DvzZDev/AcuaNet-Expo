import { create } from "zustand"

interface StoreState {
  id: string
  avatarUrl: string | null
  dirtyFavs: boolean
  setId: (newId: string) => void
  setAvatarUrl: (newUrl: string | null) => void
  setDirtyFavs: (dirty: boolean) => void
  setNewEmail: (newEmail: string) => void
  newEmail: string | null
}

export const useStore = create<StoreState>((set) => ({
  id: "",
  avatarUrl: null,
  dirtyFavs: false,
  newEmail: null,
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
  setNewEmail: (newEmail: string) =>
    set(() => ({
      newEmail: newEmail,
    })),
}))
