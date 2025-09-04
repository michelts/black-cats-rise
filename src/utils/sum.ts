export function sum(items: number[]) {
  return items.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );
}
