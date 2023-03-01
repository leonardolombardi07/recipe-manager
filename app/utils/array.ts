function reorder<T>(array: T[], startIndex: number, endIndex: number): T[] {
  const reordered = Array.from(array);
  const [removed] = reordered.splice(startIndex, 1);
  reordered.splice(endIndex, 0, removed);
  return reordered;
}

export { reorder };
