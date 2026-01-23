import { CompressionSettings, ImageMeta } from "@/types/compressor";
import { extFromMime, pickOutputMime } from "./mime";

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality01: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // PNG uchun quality browserda ignore bo'lishi mumkin — bu normal
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      mime,
      mime === "image/jpeg" || mime === "image/webp" ? quality01 : undefined
    );
  });
}

export async function compressImage(
  file: File,
  settings: CompressionSettings
): Promise<{ blob: Blob; meta: ImageMeta; fileName: string }> {
  const inputMime = file.type || "image/jpeg";
  const outMime = pickOutputMime(inputMime, settings.output);

  const quality01 = Math.min(1, Math.max(0.01, settings.quality / 100));

  // image decode
  let bmp: ImageBitmap | null = null;
  let width = 0;
  let height = 0;

  if ("createImageBitmap" in window) {
    bmp = await createImageBitmap(file);
    width = bmp.width;
    height = bmp.height;
  } else {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    width = img.naturalWidth;
    height = img.naturalHeight;
    URL.revokeObjectURL(url);

    // Image -> ImageBitmap bo'lmasa canvasga imgni chizamiz
    // (pastda bmp bo'lmasa img kerak bo'lardi, shuning uchun yana decode qilmaslik uchun)
    const canvas = document.createElement("canvas");
    const maxW = settings.maxWidth === 0 ? width : Math.min(width, settings.maxWidth);
    const scale = maxW / width;
    const outW = Math.round(width * scale);
    const outH = Math.round(height * scale);

    canvas.width = outW;
    canvas.height = outH;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("Canvas context not available");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, outW, outH);

    const blob = await canvasToBlob(canvas, outMime, quality01);
    const meta: ImageMeta = { width: outW, height: outH, type: outMime };
    const base = file.name.replace(/\.[^.]+$/, "");
    const fileName = `${base}.compressed.${extFromMime(outMime)}`;
    return { blob, meta, fileName };
  }

  // bmp path
  const maxW = settings.maxWidth === 0 ? width : Math.min(width, settings.maxWidth);
  const scale = maxW / width;
  const outW = Math.round(width * scale);
  const outH = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) throw new Error("Canvas context not available");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bmp as ImageBitmap, 0, 0, outW, outH);

  const blob = await canvasToBlob(canvas, outMime, quality01);
  bmp?.close?.();

  const meta: ImageMeta = { width: outW, height: outH, type: outMime };
  const base = file.name.replace(/\.[^.]+$/, "");
  const fileName = `${base}.compressed.${extFromMime(outMime)}`;

  return { blob, meta, fileName };
}
