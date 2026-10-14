import { whatsappUrl } from "../data/contact";

const productos = [
  { title: "Poleras y polerones", icon: "👕", description: "Tu diseño, logo o idea en prendas para regalos, equipos y negocios." },
  { title: "Tazas y mugs térmicos", icon: "☕", description: "Personaliza tus momentos con frases, fotos o la identidad de tu marca." },
  { title: "Botellas y shoperos", icon: "🍶", description: "Consulta opciones de personalización para regalos y eventos." },
  { title: "Llaveros", icon: "🔑", description: "Detalles personalizados para recuerdos, regalos y emprendimientos." },
  { title: "Cojines y mouse pads", icon: "🎁", description: "Dale un toque personal a tus espacios con tus imágenes e ideas." },
  { title: "Mochilas y gorras", icon: "🧢", description: "Opciones para equipos, negocios y regalos con identidad propia." },
  { title: "Stickers y vinilo", icon: "🏷️", description: "Personaliza empaques, productos y detalles para tu marca." },
  { title: "DTF y sublimación", icon: "🎨", description: "Conversemos sobre el material y la técnica adecuados para tu proyecto." },
];

export default function Products() {
  return (
    <div className="mt-8">
      <p className="mb-8 text-center text-gray-600">Consulta disponibilidad, cantidades y plazos al cotizar.</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {productos.map((producto) => (
          <article key={producto.title} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <span aria-hidden="true" className="mb-5 text-4xl">{producto.icon}</span>
            <h3 className="text-xl font-bold">{producto.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">{producto.description}</p>
            <a className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-green-700 px-3 py-3 text-sm font-semibold text-white hover:bg-green-800" href={whatsappUrl(`Hola, quisiera cotizar ${producto.title.toLowerCase()}. ¿Me pueden orientar con opciones, valores y plazos?`)} aria-label={`Cotizar ${producto.title} por WhatsApp`}>Cotizar por WhatsApp</a>
          </article>
        ))}
      </div>
    </div>
  );
}
