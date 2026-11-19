"use client";

import { useEffect, useRef, useState } from "react";

export default function DesignAttachment({ productId, title }: { productId: string; title: string }) {
  const [image, setImage] = useState<{ name: string; url: string } | null>(null);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    return () => { if (image) URL.revokeObjectURL(image.url); };
  }, [image]);

  return <div className="w-full rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
    <label htmlFor={"design-" + productId} className="block font-semibold">Imagen para {title}</label>
    <p id={"design-help-" + productId} className="mt-2 text-sm text-gray-600">Elige una foto o diseño JPG, PNG o WebP, hasta 10 MB. Una imagen por producto.</p>
    <input ref={input} id={"design-" + productId} type="file" accept="image/jpeg,image/png,image/webp" aria-describedby={"design-help-" + productId} className="mt-3 block w-full min-w-0 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-green-100 file:px-3 file:py-3 file:font-semibold file:text-green-900" onChange={event => {
      const file = event.currentTarget.files?.[0];
      if (!file) return;
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 10 * 1024 * 1024 || file.size === 0) {
        setError("Selecciona una imagen JPG, PNG o WebP válida de hasta 10 MB.");
        event.currentTarget.value = "";
        return;
      }
      setError("");
      setImage({ name: file.name, url: URL.createObjectURL(file) });
    }} />
    {error ? <p role="alert" className="mt-2 text-sm text-red-700">{error}</p> : null}
    {image ? <div className="mt-4">
      {/* A local blob preview is displayed directly without a server image request. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.url} alt={"Vista previa del diseño para " + title} className="max-h-48 max-w-full rounded-lg border border-gray-200 bg-white object-contain" onError={() => { setError("No pudimos leer esta imagen. Prueba con otro archivo."); setImage(null); if (input.current) input.current.value = ""; }} />
      <p className="mt-2 break-all text-sm text-gray-700">{image.name}</p>
      <button type="button" className="mt-2 min-h-11 text-sm font-semibold text-red-700 underline" onClick={() => { setImage(null); setError(""); if (input.current) input.current.value = ""; }} aria-label={"Quitar imagen de " + title}>Quitar imagen</button>
    </div> : null}
    <p className="mt-3 text-sm text-amber-900">Vista previa local: esta imagen no se guarda ni se envía con la cotización. Adjunta el archivo también en el chat de WhatsApp. Al recargar la página se pierde la selección.</p>
  </div>;
}
