import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface TrendDownProps {
  color?: string
}

export default function TrendDown({ color = "currentColor" }: TrendDownProps) {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-trending-down-3"
    >
      <Path
        d="M0 0h24v24H0z"
        stroke="none"
      />
      <Path d="M3 6h2.397a5 5 0 014.096 2.133l4.014 5.734A5 5 0 0017.603 16H21" />
      <Path d="M18 19l3-3-3-3" />
    </Svg>
  )
}
