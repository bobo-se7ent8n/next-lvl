/* ============================================================
   SHOT ARC

   A real parabola rather than a drawn curve. Given the release
   angle, the release height and the distance to the ring, there
   is exactly one trajectory that arrives at rim height — solve
   for it and every annotation follows from the same equation:

     y(x) = h + x·tanθ − k·x²      k = g / (2 v² cos²θ)

   The apex is where y'(x) = 0, so the marker cannot drift off the
   peak, and the entry angle is atan(−y'(d)) at the ring, so the
   descent cannot be drawn flat.
   ============================================================ */

export interface ArcInput {
  /** release angle above the horizontal, in degrees */
  angle: number;
  /** release height above the floor, in metres */
  releaseHeight: number;
  /** horizontal distance from release to the ring, in metres */
  distance: number;
  /** ring height, in metres */
  rimHeight: number;
}

export interface ArcSolution {
  /** y in metres at a horizontal distance x in metres */
  y: (x: number) => number;
  /** the horizontal distance at which the ball peaks */
  apexX: number;
  /** the height of that peak */
  apexY: number;
  /** the angle below the horizontal at which the ball reaches the ring */
  entryAngle: number;
  input: ArcInput;
}

const RAD = Math.PI / 180;

export function solveArc(input: ArcInput): ArcSolution {
  const { angle, releaseHeight, distance, rimHeight } = input;
  const tan = Math.tan(angle * RAD);
  /* the one curvature that puts the ball on the ring at `distance` */
  const k = (releaseHeight + distance * tan - rimHeight) / distance ** 2;
  const y = (x: number) => releaseHeight + x * tan - k * x * x;
  const apexX = tan / (2 * k);
  return {
    y,
    apexX,
    apexY: y(apexX),
    entryAngle: Math.atan(2 * k * distance - tan) / RAD,
    input,
  };
}

/** the trajectory sampled into `steps` points, in metres */
export function sampleArc(arc: ArcSolution, steps: number, overshoot = 0): Array<[number, number]> {
  const span = arc.input.distance * (1 + overshoot);
  return Array.from({ length: steps + 1 }, (_, i) => {
    const x = (span * i) / steps;
    return [x, arc.y(x)] as [number, number];
  });
}
