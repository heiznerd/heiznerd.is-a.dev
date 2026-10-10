// Original geometric shapes (100×100 artboard) used as decorative motion pieces.
// Every shape is a single <path> so MorphSVG and DrawSVG can work on it.

export const SHAPES = {
  circle: { d: 'M50 6a44 44 0 1 1 0 88a44 44 0 1 1 0-88z' },
  flower: { d: 'M50 14.88A26 26 0 1 1 85.12 50A26 26 0 1 1 50 85.12A26 26 0 1 1 14.88 50A26 26 0 1 1 50 14.88Z' },
  pill: { d: 'M30 26A20 20 0 0 1 70 26V74A20 20 0 0 1 30 74Z' },
  diamond: { d: 'M50 6Q54 6 57 9L91 43Q94 46 94 50Q94 54 91 57L57 91Q54 94 50 94Q46 94 43 91L9 57Q6 54 6 50Q6 46 9 43L43 9Q46 6 50 6Z' },
  hourglass: { d: 'M14 10H86Q92 10 88 15L56 50L88 85Q92 90 86 90H14Q8 90 12 85L44 50L12 15Q8 10 14 10Z' },
  star: { d: 'M50 2C54 36 64 46 98 50C64 54 54 64 50 98C46 64 36 54 2 50C36 46 46 36 50 2Z' },
  dome: { d: 'M4 94A46 46 0 0 1 96 94Z' },
  arch: { d: 'M12 94V52A38 38 0 0 1 88 52V94H64V56A14 14 0 0 0 36 56V94Z' },
  blob: { d: 'M54 8C78 8 94 26 92 50C90 76 72 94 48 92C24 90 8 74 8 50C8 24 30 8 54 8Z' },
  drop: { d: 'M50 6C70 30 86 46 86 64A36 36 0 0 1 14 64C14 46 30 30 50 6Z' },
  square: { d: 'M22 8H78A14 14 0 0 1 92 22V78A14 14 0 0 1 78 92H22A14 14 0 0 1 8 78V22A14 14 0 0 1 22 8Z' },
  leaf: { d: 'M8 92C8 44 44 8 92 8C92 56 56 92 8 92Z' },
  // stroke-based
  ring: { d: 'M50 16a34 34 0 1 1 0 68a34 34 0 1 1 0-68z', stroke: 18 },
  spark: { d: 'M50 10V90M10 50H90M21.7 21.7L78.3 78.3M78.3 21.7L21.7 78.3', stroke: 12 },
  squiggle: { d: 'M8 64C20 22 36 22 43 50C50 78 66 80 74 52C80 30 89 26 94 34', stroke: 12 },
  arc: { d: 'M22 70A34 34 0 1 1 74 74', stroke: 16 },
  cross: { d: 'M50 14V86M14 50H86', stroke: 20 },
  zigzag: { d: 'M6 62L24 38L42 62L60 38L78 62L94 42', stroke: 10 },
  loop: { d: 'M6 80C30 80 40 60 40 44C40 26 26 20 20 32C12 48 40 62 60 52C78 43 84 26 94 14', stroke: 6 },
};

export const PALETTES = {
  green: ['#ff5c93', '#ffb27a'],
  lime: ['#ffb27a', '#ffe9d6'],
  orange: ['#ff9a5c', '#e9b8ff'],
  peach: ['#ffd6bd', '#ff9a5c'],
  pink: ['#e9b8ff', '#e0306f'],
  candy: ['#ffc2e2', '#ff3d8b'],
  lilac: ['#ece0ff', '#a78bff'],
  violet: ['#e9b8ff', '#8a5cff'],
  blue: ['#cdeeff', '#6ad0ff'],
  summer: ['#6ad0ff', '#ffc2e2'],
  emerald: ['#ff5c93', '#8a8cff'],
  cream: ['#fff1ea', '#c9b8bf'],
  mint: ['#7be3b8', '#d4fff0'],
  sky: ['#6ad0ff', '#cdeeff'],
  rose: ['#e0306f', '#ffc2e2'],
  sunset: ['#ff9a5c', '#ff5c93'],
};
