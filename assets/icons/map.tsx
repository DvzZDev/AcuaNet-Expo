import * as React from "react"
import Svg, { Path } from "react-native-svg"

export default function Map() {
  return (
    <Svg
      width={30}
      height={30}
      viewBox="0 0 35 35"
      fill="none"
    >
      <Path
        d="M32.083 14.583v-1.14c0-2.83 0-4.244-.854-5.122-.854-.88-2.23-.88-4.979-.88h-3.031c-1.338 0-1.35-.002-2.552-.604l-4.859-2.431c-2.028-1.015-3.043-1.523-4.123-1.488-1.08.036-2.062.608-4.024 1.754l-1.79 1.045C4.43 6.56 3.709 6.98 3.313 7.68c-.396.7-.396 1.552-.396 3.257v11.983c0 2.24 0 3.36.499 3.982.332.415.797.694 1.312.786.773.14 1.72-.414 3.614-1.52 1.285-.75 2.523-1.53 4.061-1.318 1.289.177 2.487.99 3.639 1.567"
        stroke="#C7FFCD"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.667 2.917v21.875"
        stroke="#C7FFCD"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path
        d="M21.875 7.292v6.562"
        stroke="#C7FFCD"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M26.7 31.622a1.725 1.725 0 01-1.179.461c-.44 0-.863-.165-1.179-.461-2.895-2.728-6.776-5.775-4.883-10.2 1.023-2.391 3.479-3.922 6.062-3.922s5.04 1.53 6.062 3.923c1.89 4.418-1.98 7.48-4.883 10.199z"
        stroke="#C7FFCD"
        strokeWidth={2}
      />
      <Path
        d="M25.52 24.063h.014"
        stroke="#C7FFCD"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
