"use client";

import { useState } from "react";
import DesignAttachment from "./DesignAttachment";
import { products } from "../data/products";
import { whatsappUrl } from "../data/contact";

const formatPrice = (value: number) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(value);

export default function Products() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [designs, setDesigns] = useState<Partial<Record<string, File>>>({});
  const [shareNotice, setShareNotice] = useState("");
  const [sharing, setSharing] = useState(false);
  const items = products.filter(product => (quantities[product.id] ?? 0) > 0);
  const attachments = items.flatMap(product => {
    const file = designs[product.id];
    return file ? [{ title: product.title, file }] : [];
  });
  const count = items.reduce((total, product) => total + quantities[product.id], 0);
  const subtotal = items.reduce((total, product) => total + product.price * quantities[product.id], 0);
  function change(id: string, amount: number) {
    setQuantities(current => ({ ...current, [id]: Math.max(0, Math.min(999, (current[id] ?? 0) + amount)) }));
  }
  function changeDesign(id: string, file: File | null) {
    setDesigns(current => {
      const next = { ...current };
      if (file) next[id] = file;
      else delete next[id];
      return next;
    });
    setShareNotice("");
  }
  const message = [
    "Hola, quisiera cotizar este pedido de Estampa Sur:",
    ...items.map(product => `• ${product.title}: ${quantities[product.id]} unidad(es) × ${formatPrice(product.price)} = ${formatPrice(product.price * quantities[product.id])}`),
    `Subtotal de productos: ${formatPrice(subtotal)} (envío no incluido)`,
    notes.trim() ? `Detalles de personalización: ${notes.trim()}` : "",
    "¿Me pueden confirmar opciones, valores, disponibilidad y plazos?",
  ].filter(Boolean).join("\n");
  async function shareQuote() {
    setShareNotice("");
    setSharing(true);
    try {
      const links = [];
      for (const { title, file } of attachments) {
        const response = await fetch("/api/disenos", {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const result: { url?: string; error?: string } = await response.json();
        if (!response.ok || !result.url) {
          setShareNotice(result.error ?? "No pudimos guardar la imagen. Intenta de nuevo.");
          return;
        }
        links.push(`${title}: ${result.url}`);
      }
      window.location.assign(whatsappUrl([message, "Diseños (enlaces válidos por 6 días):", ...links].join("\n")));
    } catch {
      setShareNotice("No pudimos preparar los enlaces de las imágenes. Intenta de nuevo.");
    } finally {
      setSharing(false);
    }
  }
  const button = "inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700";

  return (
    <div className="mt-8">
      <p className="mb-6 text-center text-gray-600">Elige tus productos personalizados. Fabricación en 5 días hábiles; retiro en Puerto Montt o envío a cargo del cliente.</p>
      <a href="#carrito" className={button + " mb-6 bg-black text-white"}>Ver carrito ({count})</a>
      <p role="status" className="sr-only">{announcement}</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map(product => (
          <article key={product.id} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <span aria-hidden="true" className="mb-5 text-4xl">{product.icon}</span>
            <h3 className="text-xl font-bold">{product.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">{product.description}</p>
            <p className="mt-4 text-xl font-bold">{formatPrice(product.price)}</p>
            <button type="button" className={button + " mt-6 bg-green-700 text-white hover:bg-green-800"} onClick={() => { change(product.id, 1); setAnnouncement(product.title + " agregado al carrito"); }} aria-label={"Agregar " + product.title + " al carrito"}>Agregar al carrito</button>
            <a className="mt-3 py-2 text-center text-sm text-green-800 underline" href={whatsappUrl(`Hola, quisiera cotizar ${product.title.toLowerCase()}. ¿Me pueden orientar con opciones, valores y plazos?`)}>Cotizar directamente</a>
          </article>
        ))}
      </div>
      <section id="carrito" aria-labelledby="carrito-title" className="mt-10 scroll-mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h3 id="carrito-title" className="text-2xl font-bold">Tu carrito de cotización</h3>
        <p className="mt-2 text-sm text-gray-600">Revisa los productos antes de cotizar. El pago en línea todavía no está habilitado.</p>
        {items.length === 0 ? <p className="mt-6 rounded-xl bg-gray-50 p-6 text-gray-600">Tu carrito está vacío. Agrega productos del catálogo para comenzar.</p> : <>
          <ul className="mt-6 divide-y divide-gray-200">
            {items.map(product => <li key={product.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
              <div><span className="font-semibold">{product.icon} {product.title}</span><p className="mt-1 text-sm text-gray-600">{formatPrice(product.price)} por unidad · Subtotal: {formatPrice(product.price * quantities[product.id])}</p></div>
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" className={button + " border border-gray-300 disabled:opacity-40"} disabled={quantities[product.id] <= 1} onClick={() => change(product.id, -1)} aria-label={"Disminuir cantidad de " + product.title}>−</button>
                <span aria-label={"Cantidad de " + product.title}>{quantities[product.id]}</span>
                <button type="button" className={button + " border border-gray-300 disabled:opacity-40"} disabled={quantities[product.id] >= 999} onClick={() => change(product.id, 1)} aria-label={"Aumentar cantidad de " + product.title}>+</button>
                <button type="button" className={button + " text-red-700 underline"} onClick={() => {
                  setQuantities(current => ({ ...current, [product.id]: 0 }));
                  changeDesign(product.id, null);
                }} aria-label={"Quitar " + product.title}>Quitar</button>
              </div>
              <DesignAttachment productId={product.id} title={product.title} onFileChange={file => changeDesign(product.id, file)} />
            </li>)}
          </ul>
          <p className="mt-6 text-xl font-bold">Subtotal de productos: {formatPrice(subtotal)}</p>
          <p className="mt-2 text-sm text-gray-600">Envío no incluido: a cargo del cliente. También puedes retirar en Puerto Montt. Fabricación: 5 días hábiles; el transporte requiere tiempo adicional.</p>
          <label htmlFor="cart-notes" className="mt-6 block font-semibold">Cuéntanos tu idea (opcional)</label>
          <textarea id="cart-notes" rows={3} maxLength={1000} value={notes} onChange={event => setNotes(event.target.value)} placeholder="Tallas, colores, diseño o fecha en que lo necesitas…" className="mt-2 w-full rounded-lg border border-gray-300 p-3" />
          <p className="mt-4 text-sm text-gray-600">{count} unidad(es). Tu selección se mantiene mientras esta página esté abierta.</p>
          <div className="mt-6 flex flex-wrap gap-4">
            {attachments.length > 0 && <button type="button" className={button + " bg-green-700 text-white hover:bg-green-800 disabled:opacity-50"} onClick={shareQuote} disabled={sharing}>
              {sharing ? "Guardando imágenes…" : "Preparar cotización con imagen"}
            </button>}
            <a className={button + (attachments.length ? " border border-green-700 text-green-800" : " bg-green-700 text-white hover:bg-green-800")} href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer">
              {attachments.length ? "Abrir WhatsApp sin enlaces" : "Preparar cotización en WhatsApp"}
            </a>
            <button type="button" className={button + " border border-gray-300"} onClick={() => {
              setQuantities({});
              setDesigns({});
              setNotes("");
              setShareNotice("");
              setAnnouncement("Carrito vaciado");
            }}>Vaciar carrito</button>
          </div>
          <p className="mt-3 text-sm text-gray-600">{attachments.length
            ? "Al preparar la cotización con imagen, el resumen de WhatsApp incluirá enlaces para ver tus diseños durante 6 días."
            : "Se abrirá WhatsApp con el resumen. Tú decides cuándo enviarlo."}</p>
          <p role="status" className="mt-2 text-sm text-amber-900">{shareNotice}</p>
        </>}
      </section>
    </div>
  );
}
