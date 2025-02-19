export const ease = {
  linear: [0.25, 0.25, 0.75, 0.75],

  inQuad: [0.55, 0.085, 0.68, 0.53],
  inCubic: [0.55, 0.055, 0.675, 0.19],
  inQuart: [0.895, 0.03, 0.685, 0.22],
  inQuint: [0.755, 0.05, 0.855, 0.06],
  inSine: [0.47, 0.0, 0.745, 0.715],
  inExpo: [0.95, 0.05, 0.795, 0.035],
  inCirc: [0.6, 0.04, 0.98, 0.335],
  inBack: [0.6, -0.28, 0.735, 0.045],

  outQuad: [0.25, 0.46, 0.45, 0.94],
  outCubic: [0.215, 0.61, 0.355, 1.0],
  outQuart: [0.165, 0.84, 0.44, 1.0],
  outQuint: [0.23, 1.0, 0.32, 1.0],
  outSine: [0.39, 0.575, 0.565, 1.0],
  outExpo: [0.19, 1.0, 0.22, 1.0],
  outCirc: [0.075, 0.82, 0.165, 1.0],
  outBack: [0.175, 0.885, 0.32, 1.275],

  inOutQuad: [0.455, 0.03, 0.515, 0.955],
  inOutCubic: [0.645, 0.045, 0.355, 1.0],
  inOutQuart: [0.77, 0.0, 0.175, 1.0],
  inOutQuint: [0.86, 0.0, 0.07, 1.0],
  inOutSine: [0.445, 0.05, 0.55, 0.95],
  inOutExpo: [1.0, 0.0, 0.0, 1.0],
  inOutCirc: [0.785, 0.135, 0.15, 0.86],
  inOutBack: [0.68, -0.55, 0.265, 1.55],
};

export function cubicBezier(p: number[]) {
  const p0 = p[0];
  const p1 = p[1];
  const p2 = p[2];
  const p3 = p[3];

  return function (t: number) {
    const cX = 3 * p0;
    const bX = 3 * (p2 - p0) - cX;
    const aX = 1 - cX - bX;

    const cY = 3 * p1;
    const bY = 3 * (p3 - p1) - cY;
    const aY = 1 - cY - bY;

    const x = ((aX * t + bX) * t + cX) * t;
    const y = ((aY * t + bY) * t + cY) * t;

    return y;
  };
}
