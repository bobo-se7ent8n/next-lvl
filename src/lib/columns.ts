/* ============================================================
   BENTO COLUMNS

   Cards packed into independent columns, WITHOUT CSS multi-column.

   `column-count` looked right and was wrong in one specific way:
   a multi-column container has no flex gap, so the vertical space
   between stacked cards could only ever be a margin on the cards
   themselves. That is the margin-based stacking this file exists
   to delete — and it is why the vertical rhythm on Sessions and
   Insights kept failing to respond to a spacing token.

   Distributing the cards here instead gives every column a real
   `display: flex; flex-direction: column` box with a real `gap`.
   The packing is the same shape it always was: each column fills
   independently and no card waits for the tallest card in its
   row.

   Round-robin rather than shortest-column: it is deterministic,
   it needs no measurement pass, and it keeps the source order
   readable down each column.
   ============================================================ */

/** split `items` into `count` columns, round-robin */
export function columnize<T>(items: T[], count: number): T[][] {
  const safe = Math.max(1, Math.floor(count));
  const columns: T[][] = Array.from({ length: safe }, () => []);
  items.forEach((item, i) => {
    columns[i % safe].push(item);
  });
  return columns;
}

/** how many columns the bento runs at this width. The breakpoints
 *  are the ones the two grids already used. */
export function columnCountFor(width: number): number {
  if (width <= 720) return 1;
  /* THREE COLUMNS DOWN THROUGH THE 13" AIR.

     The threshold was 1280, which is exactly the width a MacBook
     Air 13" reports at its default scaled resolution — so the
     library dropped to two columns on the machine it most needed
     three on, and got taller for it. The card gets narrower instead,
     which is what the layout scale is for: reflowing the grid is a
     change of layout, and this is a change of size. */
  if (width <= 1023) return 2;
  return 3;
}
