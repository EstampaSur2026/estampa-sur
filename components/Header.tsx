import { whatsappUrl } from "../data/contact";

export default function Header() {
  return (
    <header className="border-b border-gray-100 bg-white">
      <nav aria-label="Navegación principal" className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-6 py-4 text-sm font-semibold sm:justify-between">
        <a href="#inicio" className="py-2">ESTAMPA SUR</a>
        <div className="flex flex-wrap justify-center gap-5">
          <a href="#catalogo" className="py-2">Catálogo</a>
          <a href="#contacto" className="py-2">Contacto</a>
          <a href={whatsappUrl()} className="rounded-lg bg-green-700 px-4 py-2 text-white">Cotizar</a>
        </div>
      </nav>
    </header>
  );
}
