import * as React from "react"
import Svg, { Path } from "react-native-svg"

export default function SearchBar() {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#dbfbe6"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="group-hover:stroke-green-300 hover:stroke-green-300"
    >
      <Path d="M0 0h24v24H0z" stroke="none" />
      <Path d="M3 10a7 7 0 1014 0 7 7 0 10-14 0M21 21l-6-6" />
    </Svg>
  )
}

