interface Primitives {
  Authorization: string,
  base64: BufferEncoding,
  ascii: BufferEncoding,
  splitDot: string,
}

export const primitives: Primitives = {
  Authorization: "Authorization",
  base64: "base64",
  ascii: "ascii",
  splitDot: "."
}