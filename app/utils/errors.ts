function someError(obj: Object) {
  for (const value of Object.values(obj)) {
    if (typeof value !== "object" && value) return true;
    if (typeof value === "object" && someError(value)) return true;
  }
  return false;
}

export { someError };
