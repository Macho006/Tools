export function extFromMime(mime: string): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "img";
}

export function pickOutputMime(inputMime: string, output: "auto" | "keep" | "jpeg" | "webp" | "png"): string {
  if (output === "keep") return inputMime;

  if (output === "auto") {
    if (inputMime === "image/png") return "image/webp";
    return inputMime;
  }

  if (output === "jpeg") return "image/jpeg";
  if (output === "webp") return "image/webp";
  if (output === "png") return "image/png";
  return inputMime;
}
