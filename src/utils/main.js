export class MathUtils {
  static clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  static lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // Interpolasi frame-rate independent.
  // Dipakai nanti untuk kamera follow & remote player.
  static damp(current, target, lambda, dt) {
    return MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt));
  }
}