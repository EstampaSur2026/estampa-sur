import { randomUUID } from "node:crypto";
import { issueSignedToken, presignUrl, put } from "@vercel/blob";

const maxSize = 4_000_000;
const extensions = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
    return Response.json({ error: "El almacenamiento de diseños aún no está disponible." }, { status: 503 });
  }

  const type = request.headers.get("content-type") ?? "";
  const extension = extensions.get(type);
  if (!extension) return Response.json({ error: "Usa una imagen JPG, PNG o WebP." }, { status: 415 });

  const length = Number(request.headers.get("content-length"));
  if (!Number.isSafeInteger(length) || length < 1 || length > maxSize) {
    return Response.json({ error: "La imagen debe pesar hasta 4 MB." }, { status: 413 });
  }

  try {
    const bytes = Buffer.from(await request.arrayBuffer());
    if (bytes.length !== length) return Response.json({ error: "La imagen está incompleta." }, { status: 400 });
    const valid = extension === "jpg"
      ? bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255]))
      : extension === "png"
        ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        : bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
    if (!valid) return Response.json({ error: "El archivo no coincide con el formato de imagen." }, { status: 415 });

    const pathname = `cotizaciones/${randomUUID()}.${extension}`;
    const validUntil = Date.now() + 6 * 24 * 60 * 60 * 1000;
    const token = await issueSignedToken({ pathname, operations: ["get"], validUntil });
    const { presignedUrl } = await presignUrl(token, { access: "private", pathname, operation: "get", validUntil });
    await put(pathname, bytes, { access: "private", contentType: type, ttlDays: 7 });
    return Response.json({ url: presignedUrl }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "No pudimos guardar la imagen. Intenta de nuevo." }, { status: 502 });
  }
}
