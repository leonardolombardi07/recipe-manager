function hasTruthyValue(obj: any): boolean {
  for (const key in obj) {
    const value = obj[key];
    if (value !== null && typeof value === "object") {
      if (hasTruthyValue(value)) {
        return true;
      }
    } else if (value) {
      return true;
    }
  }
  return false;
}

export { hasTruthyValue };
