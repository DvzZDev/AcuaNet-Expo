import { create } from "zustand"

interface StoreState {
  id: string | null
  avatarUrl: string | null
  dirtyFavs: boolean
  setId: (newId: string | null) => void
  setAvatarUrl: (newUrl: string | null) => void
  setDirtyFavs: (dirty: boolean) => void
  setNewEmail: (newEmail: string) => void
  newEmail: string | null
}

export const useStore = create<StoreState>((set) => ({
  id: null,
  avatarUrl: null,
  dirtyFavs: false,
  newEmail: null,
  setId: (newId: string | null) =>
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
