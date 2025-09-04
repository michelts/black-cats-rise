export function getSector(position: number) {
  return Math.min(Math.trunc(position / 33), 2);
}
