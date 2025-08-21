export function makeTeamNames(count: number) {
  return Array(count)
    .fill(null)
    .map((_, index) => "Team " + index);
}
