export function Capitalice(text: string): string {
  return (
    text.charAt(0).toUpperCase() +
    text.slice(1).replace(/(\s+)(\w)/g, (match, space, letter) => space + letter.toUpperCase())
  )
}
