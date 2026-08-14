/* ============================================================
   BACKGROUND SETTINGS

   Three independent decorative layers behind everything. Each has
   its own switch, so any combination is valid — including all
   three off. The defaults below are the shipped look.
   ============================================================ */

export interface LinesSettings {
  on: boolean;
  /** 0..1 */
  opacity: number;
  /** px */
  width: number;
  /** how many lines across the viewport */
  count: number;
}

export interface GrainSettings {
  on: boolean;
  opacity: number;
  /** contrast of the noise itself */
  amount: number;
  /** grain size */
  scale: number;
}

export interface AsciiSettings {
  on: boolean;
  opacity: number;
  /** px per cell */
  cell: number;
  /** px glyph size */
  fontSize: number;
  seed: number;
}

export interface BackgroundSettings {
  lines: LinesSettings;
  grain: GrainSettings;
  ascii: AsciiSettings;
}

export const BACKGROUND_DEFAULTS: BackgroundSettings = {
  lines: { on: true, opacity: 0.11, width: 2, count: 16 },
  grain: { on: true, opacity: 0.2, amount: 0.7, scale: 1.4 },
  ascii: { on: false, opacity: 0.1, cell: 26, fontSize: 10, seed: 20260805 },
};
