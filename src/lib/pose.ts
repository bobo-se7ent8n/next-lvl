/* ============================================================
   POSE

   Real motion with real volume, sampled as CLOUDS.

   The first version was a stick skeleton: three flat figures on a
   shared baseline. The second sampled the surface of a tube
   around every bone, which gave depth but drew each limb as a
   dense outline — a solid shape with a hard edge, which is not
   what a point cloud from a sensor looks like.

   This one scatters points through the VOLUME of each limb:
   dense along the core, thinning outward, with a haze past the
   nominal radius so the silhouette is implied by density instead
   of drawn by an edge. Every dot carries its own size, and both
   size and opacity fall away toward the surface, so a body
   dissolves rather than stops.

   The scatter is precomputed once and mapped onto the bones each
   frame. That is what keeps the cloud from fizzing while the
   playhead moves: the body moves, the dots do not rearrange
   inside it.

   Axes: x to the right, y up, z INTO the screen. The origin is on
   the floor at the middle of the stage. Everything is a pure
   function of t, so scrubbing lands on the same frame every time.
   There is no 3D library involved and there is not going to be
   one — this is a canvas approximation and it says so.
   ============================================================ */

import { seeded } from './chart';

export type PointGroup = 'you' | 'opponents' | 'ball' | 'floor';

/** one sampled point of a body, in metres */
export interface VolumePoint {
  x: number;
  y: number;
  z: number;
  group: PointGroup;
  /** 0..1 — how solid the point is before the camera dims it */
  weight: number;
  /** 0.5..1.5 — this dot's own size, relative to the base dot */
  size: number;
}

/** the pose parameters the whole figure is built from */
export interface Pose {
  /** 0..1 knee bend */
  knee: number;
  /** 0..1 shooting-arm elevation, 1 is fully extended overhead */
  arm: number;
  /** 0..1 how far the hands are carried out in front of the chest */
  reach: number;
  /** torso lean, radians */
  lean: number;
  /** metres of drift along the baseline */
  x: number;
  /** metres from the camera */
  z: number;
  /** metres off the floor */
  jump: number;
  /** how far the ball has left the hands, 0..1 */
  ball: number;
}

/** the six phases, with the share of the moment each one really takes.
 *  A drive is long and a release is not; drawing them equal was the
 *  timeline's worst lie. */
export const PHASES = [
  { id: 'catch', label: 'catch', share: 0.1 },
  { id: 'drive', label: 'drive', share: 0.26 },
  { id: 'gather', label: 'gather', share: 0.12 },
  { id: 'release', label: 'release', share: 0.08 },
  { id: 'land', label: 'land', share: 0.14 },
  { id: 'recover', label: 'recover', share: 0.3 },
] as const;

export type PhaseId = (typeof PHASES)[number]['id'];

/** the phases as cumulative [from, to] spans across the moment */
export const PHASE_SPANS = (() => {
  let at = 0;
  return PHASES.map((phase) => {
    const from = at;
    at += phase.share;
    return { ...phase, from, to: at };
  });
})();

/* Basketball, not calisthenics. The old keyframes started the arms
   near the horizontal and left them there, so a figure labelled CATCH
   stood in a T-pose. A catch is hands up and forward with the knees
   already loaded; a drive is low and leaning with the ball hand down;
   a gather is the deepest bend of the sequence; a release is full
   extension off the floor. */
const KEYFRAME: Record<PhaseId, Pose> = {
  catch:   { knee: 0.38, arm: 0.48, reach: 0.88, lean: 0.10, x: 0.0,  z: 0.30,  jump: 0,    ball: 0 },
  drive:   { knee: 0.54, arm: 0.10, reach: 0.30, lean: 0.30, x: 0.5,  z: -0.10, jump: 0,    ball: 0 },
  gather:  { knee: 0.80, arm: 0.54, reach: 0.40, lean: 0.14, x: 0.8,  z: -0.35, jump: 0,    ball: 0 },
  release: { knee: 0.05, arm: 1.00, reach: 0.58, lean: -0.05, x: 0.9, z: -0.40, jump: 0.36, ball: 0.1 },
  land:    { knee: 0.62, arm: 0.38, reach: 0.26, lean: 0.08, x: 0.95, z: -0.30, jump: 0,    ball: 0.7 },
  recover: { knee: 0.18, arm: 0.12, reach: 0.16, lean: 0.02, x: 0.9,  z: -0.10, jump: 0,    ball: 1 },
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

function blend(a: Pose, b: Pose, t: number): Pose {
  const k = ease(Math.min(1, Math.max(0, t)));
  return {
    knee: lerp(a.knee, b.knee, k),
    arm: lerp(a.arm, b.arm, k),
    reach: lerp(a.reach, b.reach, k),
    lean: lerp(a.lean, b.lean, k),
    x: lerp(a.x, b.x, k),
    z: lerp(a.z, b.z, k),
    jump: lerp(a.jump, b.jump, k),
    ball: lerp(a.ball, b.ball, k),
  };
}

/** which phase the moment is in at t, and how far through it */
export function phaseAt(t: number) {
  const clamped = Math.min(0.9999, Math.max(0, t));
  const span = PHASE_SPANS.find((p) => clamped >= p.from && clamped < p.to) ?? PHASE_SPANS[0];
  return { ...span, progress: (clamped - span.from) / (span.to - span.from) };
}

/** the interpolated pose at t */
export function poseAt(t: number): Pose {
  const { id, progress } = phaseAt(t);
  const index = PHASES.findIndex((p) => p.id === id);
  const next = PHASES[Math.min(PHASES.length - 1, index + 1)];
  return blend(KEYFRAME[id], KEYFRAME[next.id], progress);
}

/** how close the nearest opponent is at t, 0 = contact, 1 = clear.
 *  The closeout arrives late — separation collapses through the
 *  gather and opens again once the shot is away. */
export function separationAt(t: number): number {
  const closeness = Math.exp(-(((t - 0.46) / 0.16) ** 2));
  return 1 - 0.86 * closeness;
}

/* ------------------------------------------------------------
   THE SCATTER

   One table, built once. Each entry is a position inside a unit
   capsule — how far along it sits, which way out it points, and
   how far out — plus its own size. Mapping the table onto a bone
   is what puts a cloud around that bone, and because the table
   never changes the cloud is stable while the body moves.
   ------------------------------------------------------------ */

interface Sample {
  /** 0..1 along the bone */
  u: number;
  /** the radial direction, as a unit angle in the bone's own frame */
  angle: number;
  /** 0..1.25 — how far out. Past 1 is haze. */
  rho: number;
  /** the dot's own size multiplier */
  size: number;
  /** how solid it is: full at the core, gone at the edge */
  weight: number;
}

/** points scattered through a capsule, densest along its axis */
function scatterTable(count: number, seed: number): Sample[] {
  const rand = seeded(seed);
  const out: Sample[] = [];
  for (let i = 0; i < count; i++) {
    /* A disc sampled uniformly by area wants rand^0.5; anything above
       that crowds toward the axis. 0.8 is denser at the core than
       uniform while still filling the body out — the first version
       used 1.7, which left a thin bright spine and almost nothing
       around it. The last tenth is pushed past the nominal radius as
       haze, which is what makes the edge dissolve instead of end. */
    const r = rand();
    const haze = r > 0.9;
    const rho = haze ? 1 + rand() * 0.4 : Math.pow(rand(), 0.8);
    out.push({
      u: rand(),
      angle: rand() * Math.PI * 2,
      rho,
      size: 0.55 + rand() * 0.85,
      weight: Math.max(0.05, 1 - Math.pow(rho, 1.6) * 0.9),
    });
  }
  return out;
}

/* one table per bone slot, so no two limbs carry the same cloud */
const BONE_SCATTER = Array.from({ length: 12 }, (_, slot) =>
  scatterTable(slot === 0 ? 340 : 155, 7919 + slot * 3671),
);

const HEAD_SCATTER = scatterTable(190, 99991);

type V3 = [number, number, number];

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const norm = (a: V3): number => Math.hypot(a[0], a[1], a[2]);
const scale = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

function unit(a: V3): V3 {
  const n = norm(a) || 1;
  return scale(a, 1 / n);
}

interface Bone {
  a: V3;
  b: V3;
  /** capsule radius at each end, in metres */
  r0: number;
  r1: number;
}

/** one bone, as a cloud of points through its volume */
function cloudBone(bone: Bone, slot: number, group: PointGroup, detail: number, out: VolumePoint[]) {
  const axis = sub(bone.b, bone.a);
  const len = norm(axis) || 0.0001;
  const d = unit(axis);
  /* an orthonormal frame around the bone — the reference vector is
     chosen so it is never parallel to the axis */
  const ref: V3 = Math.abs(d[2]) < 0.85 ? [0, 0, 1] : [0, 1, 0];
  const u = unit(cross(d, ref));
  const v = cross(d, u);

  const table = BONE_SCATTER[slot % BONE_SCATTER.length];
  const take = Math.max(12, Math.round(table.length * detail));

  for (let i = 0; i < take; i++) {
    const s = table[i];
    const r = lerp(bone.r0, bone.r1, s.u) * s.rho;
    const ca = Math.cos(s.angle);
    const sa = Math.sin(s.angle);
    out.push({
      x: bone.a[0] + d[0] * len * s.u + (u[0] * ca + v[0] * sa) * r,
      y: bone.a[1] + d[1] * len * s.u + (u[1] * ca + v[1] * sa) * r,
      z: bone.a[2] + d[2] * len * s.u + (u[2] * ca + v[2] * sa) * r,
      group,
      weight: s.weight,
      size: s.size,
    });
  }
}

/** a ball of points — the head, and the basketball */
function cloudBall(centre: V3, radius: number, group: PointGroup, detail: number, out: VolumePoint[]) {
  const take = Math.max(14, Math.round(HEAD_SCATTER.length * detail));
  for (let i = 0; i < take; i++) {
    const s = HEAD_SCATTER[i];
    /* the sample's u doubles as the polar angle here */
    const phi = s.u * Math.PI;
    const ring = Math.sin(phi) * radius * s.rho;
    out.push({
      x: centre[0] + Math.cos(s.angle) * ring,
      y: centre[1] + Math.cos(phi) * radius * s.rho,
      z: centre[2] + Math.sin(s.angle) * ring,
      group,
      weight: s.weight,
      size: s.size,
    });
  }
}

/* ------------------------------------------------------------
   THE FIGURE
   ------------------------------------------------------------ */

interface Figure {
  bones: Bone[];
  head: V3;
  headR: number;
  hand: V3;
}

/** the skeleton for one pose, in metres, with a thickness on every
 *  bone. `facing` is +1 for a figure turned to the right. */
function figure(p: Pose, facing = 1, build = 1): Figure {
  const hipY = 0.92 - p.knee * 0.3 + p.jump;
  const hip: V3 = [p.x, hipY, p.z];
  const neck: V3 = [
    hip[0] + Math.sin(p.lean) * 0.62 * facing,
    hip[1] + Math.cos(p.lean) * 0.62,
    hip[2] - Math.sin(p.lean) * 0.1,
  ];
  const head: V3 = [neck[0] + Math.sin(p.lean) * 0.14 * facing, neck[1] + 0.19, neck[2] - 0.03];

  /* An arm has two freedoms here, and the second one is what the old
     model was missing: `arm` swings it up, and `reach` swings it
     FORWARD. Without the second one every angle short of straight up
     put the arm out sideways, which is why a figure labelled CATCH
     stood in a T-pose. Reaching trades lateral extent for forward
     extent, so hands come toward the camera rather than away from the
     body. */
  const shoot = lerp(-1.25, 1.5, p.arm);
  const lateral = 1 - 0.86 * p.reach;
  const fwd = 0.9 * p.reach;
  const limb = (from: V3, angle: number, len: number, side: number): V3 => [
    from[0] + Math.cos(angle) * len * lateral * side,
    from[1] + Math.sin(angle) * len,
    from[2] - len * fwd * Math.cos(angle),
  ];

  const shoulder: V3 = [neck[0] + 0.16 * facing, neck[1] - 0.05, neck[2] - 0.05];
  const elbow = limb(shoulder, shoot, 0.28, facing);
  /* the forearm carries a real bend rather than continuing the line */
  const hand = limb(elbow, shoot + 0.5, 0.3, facing);

  /* the off arm supports rather than mirrors: it never goes overhead */
  const off = lerp(-1.3, 0.62, p.arm * 0.78);
  const offShoulder: V3 = [neck[0] - 0.16 * facing, neck[1] - 0.05, neck[2] - 0.03];
  const offElbow = limb(offShoulder, off, 0.26, -facing);
  const offHand = limb(offElbow, off + 0.62, 0.25, -facing);

  /* the knees track forward over the toes as the bend deepens */
  const kneeDrop = 0.46 - p.knee * 0.16;
  const kneeFwd = -0.16 * p.knee;
  const kneeL: V3 = [hip[0] - 0.13, hip[1] - kneeDrop, hip[2] + 0.11 + kneeFwd];
  const kneeR: V3 = [hip[0] + 0.15, hip[1] - kneeDrop, hip[2] - 0.11 + kneeFwd];
  const footL: V3 = [hip[0] - 0.17, p.jump * 0.4, hip[2] + 0.16];
  const footR: V3 = [hip[0] + 0.2, p.jump * 0.4, hip[2] - 0.14];

  const t = build;
  return {
    head,
    headR: 0.125 * t,
    hand,
    bones: [
      /* the torso is the mass of the figure and carries the most dots */
      { a: hip, b: neck, r0: 0.2 * t, r1: 0.17 * t },
      { a: neck, b: head, r0: 0.075 * t, r1: 0.065 * t },
      { a: shoulder, b: elbow, r0: 0.075 * t, r1: 0.058 * t },
      { a: elbow, b: hand, r0: 0.058 * t, r1: 0.042 * t },
      { a: offShoulder, b: offElbow, r0: 0.072 * t, r1: 0.056 * t },
      { a: offElbow, b: offHand, r0: 0.056 * t, r1: 0.04 * t },
      { a: hip, b: kneeL, r0: 0.11 * t, r1: 0.075 * t },
      { a: kneeL, b: footL, r0: 0.075 * t, r1: 0.05 * t },
      { a: hip, b: kneeR, r0: 0.11 * t, r1: 0.075 * t },
      { a: kneeR, b: footR, r0: 0.075 * t, r1: 0.05 * t },
    ],
  };
}

/** the opponents' own drift — deterministic, and tied to separation.
 *  One stands behind the shooter and one in front of them, so the
 *  camera has something to prove depth against. */
const OPPONENTS = [
  { base: 1.9, facing: -1, z: 1.7, build: 1.04 },
  { base: -1.7, facing: 1, z: -1.35, build: 0.96 },
];

/* ------------------------------------------------------------
   THE DEFENDERS' OWN PHASES

   The opponents used to be posed from separation alone: arms at a
   fixed low elevation carried out to the side, which at any phase
   read as a T-pose standing next to a player who was clearly
   playing basketball. A defender is doing something specific at
   every beat of a possession, and it is not the same thing the
   shooter is doing — so they get their own keyframes, blended on
   the same phase clock.

   Index 0 is the ON-BALL defender: closes out, slides, contests,
   comes down. Index 1 is the HELP defender: in a stance, rotates
   over, steps in on the gather, turns and boxes out on the land.
   ------------------------------------------------------------ */
type DefenderPose = Pick<Pose, 'knee' | 'arm' | 'reach' | 'lean' | 'jump'>;

const DEFENDER_KEYFRAME: Record<PhaseId, DefenderPose>[] = [
  /* on-ball */
  {
    /* high hand into the closeout, already sitting down in the legs */
    catch:   { knee: 0.52, arm: 0.86, reach: 0.62, lean: 0.16, jump: 0 },
    /* sliding with the drive: low, wide, hands out and down */
    drive:   { knee: 0.78, arm: 0.30, reach: 0.74, lean: 0.26, jump: 0 },
    /* the gather is when the hand starts up */
    gather:  { knee: 0.70, arm: 0.72, reach: 0.52, lean: 0.10, jump: 0 },
    /* full contest, off the floor, arm at full extension */
    release: { knee: 0.10, arm: 1.00, reach: 0.40, lean: -0.08, jump: 0.30 },
    /* coming down, arm falling */
    land:    { knee: 0.58, arm: 0.44, reach: 0.34, lean: 0.06, jump: 0 },
    /* back into a stance */
    recover: { knee: 0.44, arm: 0.22, reach: 0.40, lean: 0.06, jump: 0 },
  },
  /* help */
  {
    /* in a stance, hands low and wide, watching the ball */
    catch:   { knee: 0.56, arm: 0.24, reach: 0.66, lean: 0.08, jump: 0 },
    /* rotating over as the drive commits — one hand up */
    drive:   { knee: 0.62, arm: 0.58, reach: 0.48, lean: 0.20, jump: 0 },
    /* stepping in, both hands up */
    gather:  { knee: 0.74, arm: 0.80, reach: 0.44, lean: 0.12, jump: 0 },
    /* verticality — tall, arms up, feet down */
    release: { knee: 0.30, arm: 0.94, reach: 0.30, lean: -0.04, jump: 0.06 },
    /* turns and boxes out: seated in the legs, arms wide */
    land:    { knee: 0.80, arm: 0.30, reach: 0.82, lean: 0.18, jump: 0 },
    /* releases the box-out and stands up */
    recover: { knee: 0.30, arm: 0.14, reach: 0.30, lean: 0.04, jump: 0 },
  },
];

/** the defender's pose at t, blended across the same phase clock the
 *  shooter runs on so the two read as one possession */
function defenderPoseAt(t: number, role: number): DefenderPose {
  const { id, progress } = phaseAt(t);
  const table = DEFENDER_KEYFRAME[role];
  const index = PHASES.findIndex((p) => p.id === id);
  const next = PHASES[Math.min(PHASES.length - 1, index + 1)];
  const a = table[id];
  const b = table[next.id];
  const k = ease(Math.min(1, Math.max(0, progress)));
  return {
    knee: lerp(a.knee, b.knee, k),
    arm: lerp(a.arm, b.arm, k),
    reach: lerp(a.reach, b.reach, k),
    lean: lerp(a.lean, b.lean, k),
    jump: lerp(a.jump, b.jump, k),
  };
}

export interface FrameOptions {
  /** 0.4 … 1.4 — how many points each body is sampled at */
  detail?: number;
}

/** every point on the stage at time t, in metres */
export function frameVolume(t: number, { detail = 1 }: FrameOptions = {}): VolumePoint[] {
  const out: VolumePoint[] = [];
  const you = poseAt(t);
  const sep = separationAt(t);

  const me = figure(you, 1, 1);
  me.bones.forEach((bone, slot) => cloudBone(bone, slot, 'you', detail, out));
  cloudBall(me.head, me.headR, 'you', detail, out);

  /* the defenders close as separation collapses and open again after.
     WHAT they are doing comes from the phase; HOW CLOSE they are
     comes from separation. Posing them from separation alone left
     them standing in a T-pose through the whole possession. */
  OPPONENTS.forEach((opp, i) => {
    const drift = opp.base * (0.34 + sep * 0.66);
    const d = defenderPoseAt(t, i);
    const press = 1 - sep;
    const pose: Pose = {
      /* contact deepens the stance a little on top of the phase */
      knee: Math.min(1, d.knee + press * 0.1),
      arm: d.arm,
      reach: d.reach,
      lean: opp.facing * d.lean,
      x: you.x + drift,
      z: opp.z + press * -0.25,
      jump: d.jump,
      ball: 0,
    };
    const f = figure(pose, opp.facing, opp.build);
    f.bones.forEach((bone, slot) => cloudBone(bone, slot, 'opponents', detail * 0.78, out));
    cloudBall(f.head, f.headR, 'opponents', detail * 0.78, out);
  });

  /* the ball: in the hands until release, then away on its own arc,
     travelling toward the ring — which is up-court, so it recedes */
  const flight = you.ball;
  const ballCentre: V3 =
    flight <= 0
      ? [me.hand[0] + 0.08, me.hand[1] + 0.05, me.hand[2] - 0.06]
      : [
          me.hand[0] + 0.08 + flight * 2.4,
          me.hand[1] + 0.05 + flight * 2.0 - flight * flight * 2.6,
          me.hand[2] - 0.06 + flight * 1.6,
        ];
  cloudBall(ballCentre, 0.115, 'ball', detail * 0.9, out);

  return out;
}

/** the floor plane — concentric rings lying at y = 0. The camera turns
 *  a circle on the ground into an ellipse, and the ellipse is what
 *  tells the eye there is a floor at all. */
export function floorRings({ detail = 1 }: FrameOptions = {}): VolumePoint[] {
  const out: VolumePoint[] = [];
  const rings = 5;
  for (let r = 1; r <= rings; r++) {
    const radius = (r / rings) * STAGE_EXTENT.x;
    const around = Math.max(24, Math.round(radius * 22 * detail));
    for (let k = 0; k < around; k++) {
      const a = (k / around) * Math.PI * 2;
      out.push({
        x: Math.cos(a) * radius,
        y: 0,
        z: Math.sin(a) * radius * 0.55,
        group: 'floor',
        weight: 0.34 + 0.3 * (1 - r / rings),
        size: 0.8,
      });
    }
  }
  return out;
}

/** how far the stage reaches, in metres either side of the origin.
 *  `y` is the top of the frame: a shooter at full extension reaches
 *  about 2.6m, and anything above that is headroom nobody needs. */
export const STAGE_EXTENT = { x: 4.4, y: 2.85, z: 2.6 };

/** The camera. It stands back from the origin and slightly above the
 *  floor, which is the whole reason the ground reads as a plane: with
 *  the eye at floor level every point of it would land on one line. */
export const CAMERA: { distance: number; height: number } = { distance: 8.2, height: 1.55 };

/** how far the orbit may be dragged, in radians and in metres */
export const ORBIT = { yaw: Math.PI * 0.42, liftMin: 0.7, liftMax: 2.9 } as const;

/** the foreshortening factor for a point at depth z — 1 at the origin,
 *  larger in front of it, smaller behind it */
export function foreshorten(z: number): number {
  return CAMERA.distance / Math.max(0.6, CAMERA.distance + z);
}

/** spin a point around the stage's vertical axis — the orbit */
export function orbit(p: VolumePoint, yaw: number): { x: number; y: number; z: number } {
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
}
