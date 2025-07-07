import { GPSCoordinates } from "lib/extractGPSCoordinates"

type State = {
  embalse: string | null
  images: string[]
  coordinates: GPSCoordinates | null
  userCoordinates: GPSCoordinates | null
  imageDate: string | null
  currentStep: number
  isEditMode: boolean
  heights: number[]
  isSending: boolean
  isSuccess: boolean
  isError: boolean
}

type Action =
  | { type: "setEmbalse"; payload: string }
  | { type: "setImages"; payload: string[] }
  | { type: "setCoordinates"; payload: GPSCoordinates | null }
  | { type: "setUserCoordinates"; payload: GPSCoordinates | null }
  | { type: "setImageDate"; payload: string | null }
  | { type: "setCurrentStep"; payload: number }
  | { type: "setIsEditMode"; payload: boolean }
  | { type: "setHeights"; payload: number[] }
  | { type: "setIsSending"; payload: boolean }
  | { type: "setIsSuccess"; payload: boolean }
  | { type: "setIsError"; payload: boolean }

export const inicialStateImageReducer: State = {
  embalse: null,
  images: [],
  coordinates: null,
  userCoordinates: null,
  imageDate: null,
  currentStep: 0,
  isEditMode: false,
  heights: [0, 0, 0, 0, 0],
  isSending: false,
  isSuccess: false,
  isError: false,
}

export function uploadImageReducer(state: State, action: Action): State {
  switch (action.type) {
    case "setEmbalse":
      return { ...state, embalse: action.payload }
    case "setImages":
      return { ...state, images: action.payload }
    case "setCoordinates":
      return { ...state, coordinates: action.payload }
    case "setUserCoordinates":
      return { ...state, userCoordinates: action.payload }
    case "setImageDate":
      return { ...state, imageDate: action.payload }
    case "setCurrentStep":
      return { ...state, currentStep: action.payload }
    case "setIsEditMode":
      return { ...state, isEditMode: action.payload }
    case "setHeights":
      return { ...state, heights: action.payload }
    case "setIsSending":
      return { ...state, isSending: action.payload }
    case "setIsSuccess":
      return { ...state, isSuccess: action.payload }
    case "setIsError":
      return { ...state, isError: action.payload }
    default:
      return state
  }
}
