export const whatsappPhone = "56923931601";
export const whatsappLabel = "+56 9 2393 1601";
export function whatsappUrl(message = "Hola, me interesa un producto personalizado de Estampa Sur. Quisiera más información.") {
  return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
}
