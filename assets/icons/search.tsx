import * as React from "react"
import Svg, { Path } from "react-native-svg"

export default function Search() {
  return (
    <Svg
      width={30}
      height={30}
      viewBox="0 0 36 35"
      fill="none"
    >
      <Path
        d="M23.834 24.063l5.833 5.833M26.75 16.77c0 5.639-4.57 10.21-10.208 10.21S6.333 22.408 6.333 16.77c0-5.637 4.57-10.207 10.209-10.207"
        stroke="#C7FFCD"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M23.104 5.104l.376 1.017c.494 1.333.74 2 1.226 2.485.486.486 1.153.733 2.486 1.226l1.016.376-1.016.377c-1.333.493-2 .74-2.486 1.225-.486.487-.732 1.153-1.226 2.486l-.376 1.017-.376-1.017c-.493-1.333-.74-2-1.226-2.486-.486-.486-1.153-.732-2.485-1.226L18 10.209l1.017-.376c1.332-.493 1.999-.74 2.485-1.226.486-.486.733-1.152 1.226-2.485l.376-1.017z"
        stroke="#C7FFCD"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
