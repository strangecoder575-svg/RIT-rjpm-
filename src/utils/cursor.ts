export function getCursorForDepartment(kind: string, color: string): string {
  const shapes: Record<string, string> = {
    cube: `<rect x="6" y="6" width="16" height="16" fill="none" stroke="${color}" stroke-width="2.5" transform="rotate(20 14 14)"/><rect x="10" y="10" width="16" height="16" fill="none" stroke="${color}" stroke-width="2.5" opacity=".7"/>`,
    orbit: `<circle cx="16" cy="16" r="4" fill="${color}"/><ellipse cx="16" cy="16" rx="13" ry="6" fill="none" stroke="${color}" stroke-width="2.5" transform="rotate(30 16 16)"/>`,
    globe: `<circle cx="16" cy="16" r="11" fill="none" stroke="${color}" stroke-width="2.5"/><ellipse cx="16" cy="16" rx="5" ry="11" fill="none" stroke="${color}" stroke-width="2"/>`,
    bars: `<rect x="6" y="16" width="5" height="10" fill="${color}"/><rect x="13" y="10" width="5" height="16" fill="${color}"/><rect x="20" y="4" width="5" height="22" fill="${color}"/>`,
    wave: `<path d="M4 16 Q9 4 14 16 T24 16 T29 16" fill="none" stroke="${color}" stroke-width="3"/>`,
    bolt: `<polygon points="19,3 8,18 15,18 12,29 24,13 16,13" fill="${color}" stroke="#08090d" stroke-width="1.2"/>`,
    gear: `<circle cx="16" cy="16" r="6" fill="none" stroke="${color}" stroke-width="2.5"/><g stroke="${color}" stroke-width="2.5"><line x1="16" y1="2" x2="16" y2="7"/><line x1="16" y1="25" x2="16" y2="30"/><line x1="2" y1="16" x2="7" y2="16"/><line x1="25" y1="16" x2="30" y2="16"/><line x1="6" y1="6" x2="10" y2="10"/><line x1="22" y1="22" x2="26" y2="26"/><line x1="26" y1="6" x2="22" y2="10"/><line x1="10" y1="22" x2="6" y2="26"/></g>`,
    blocks: `<rect x="8" y="20" width="16" height="6" fill="${color}"/><rect x="10" y="12" width="12" height="6" fill="${color}" opacity=".85"/><rect x="12" y="4" width="8" height="6" fill="${color}" opacity=".7"/>`,
    atom: `<circle cx="16" cy="16" r="3.5" fill="${color}"/><ellipse cx="16" cy="16" rx="13" ry="5" fill="none" stroke="${color}" stroke-width="2"/><ellipse cx="16" cy="16" rx="13" ry="5" fill="none" stroke="${color}" stroke-width="2" transform="rotate(60 16 16)"/><ellipse cx="16" cy="16" rx="13" ry="5" fill="none" stroke="${color}" stroke-width="2" transform="rotate(-60 16 16)"/>`
  };

  const shape = shapes[kind] || shapes.cube;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='34' height='34' viewBox='0 0 32 32'><circle cx="16" cy="16" r="15" fill="#08090de6" stroke="${color}" stroke-width="1.2"/>${shape}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 16 16, pointer`;
}
