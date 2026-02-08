import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// URLs do Brawlify CDN para imagens oficiais e estáveis
const BRAWLIFY_CDN = "https://cdn.brawlify.com";

export function getMapAsset(id: number | string | undefined | null) {
  if (!id) return `${BRAWLIFY_CDN}/maps/regular/15000000.png`; // Fallback para um mapa padrão
  return `${BRAWLIFY_CDN}/maps/regular/${id}.png`;
}

export function getModeAsset(name: string | undefined | null) {
  // Proteção contra o erro TypeError: e.toLowerCase is not a function
  if (!name || typeof name !== 'string') {
    return `${BRAWLIFY_CDN}/gamemode/gem-grab.png`; // Fallback para Pique-Gema
  }
  const formattedName = name.toLowerCase().replace(/\s+/g, "-");
  return `${BRAWLIFY_CDN}/gamemode/${formattedName}.png`;
}

export function getBrawlerPin(id: number | string | undefined | null) {
  if (!id) return `${BRAWLIFY_CDN}/brawlers/portrait/16000000.png`; // Fallback Shelly
  return `${BRAWLIFY_CDN}/brawlers/borderless/${id}.png`;
}

export function getBrawlerPortrait(id: number | string | undefined | null) {
  if (!id) return `${BRAWLIFY_CDN}/brawlers/portrait/16000000.png`;
  return `${BRAWLIFY_CDN}/brawlers/portrait/${id}.png`;
}

export function getIconAsset(id: number | string | undefined | null) {
  if (!id) return `${BRAWLIFY_CDN}/profile-icons/regular/28000000.png`;
  return `${BRAWLIFY_CDN}/profile-icons/regular/${id}.png`;
}

export function getSeasonAsset(id: number | string | undefined | null) {
  if (!id) return "https://images.supercell.com/image/upload/q_auto,f_auto/v1/brawlstars/news/brawlentines-season-is-here.jpg";
  return `https://images.supercell.com/image/upload/q_auto,f_auto/v1/brawlstars/news/season-${id}-header.jpg`;
}
