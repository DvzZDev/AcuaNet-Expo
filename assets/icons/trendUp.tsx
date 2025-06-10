import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface TrendUpProps {
  color?: string
}

export default function TrendUp({ color = "currentColor" }: TrendUpProps) {
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
    >
      <Path
        d="M0 0h24v24H0z"
        stroke="none"
      />
      <Path d="M18 5l3 3-3 3" />
      <Path d="M3 18h2.397a5 5 0 004.096-2.133l4.014-5.734A5 5 0 0117.603 8H21" />
    </Svg>
  )
}
