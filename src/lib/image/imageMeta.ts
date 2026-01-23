export async function readImageMeta(file: File): Promise<{ width: number; height: number; type: string }> {
  if ("createImageBitmap" in window) {
    const bmp = await createImageBitmap(file);
    const meta = { width: bmp.width, height: bmp.height, type: file.type };
    bmp.close?.();
    return meta;
  }


  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    return { width: img.naturalWidth, height: img.naturalHeight, type: file.type };
  } finally {
    URL.revokeObjectURL(url);
  }
}
