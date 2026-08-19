/** the viewport point a hovered element should anchor a tooltip to.
 *  Tooltips are painted at the document root, so they are positioned
 *  in viewport coordinates rather than relative to any card. */
export function anchorOf(el: Element): { x: number; y: number } {
  const rect = el.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top };
}
