function isNumeric(value: any) {
  return (
    !isNaN(value) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(value))
  ); // ...and ensure strings of whitespace fail
}

function extractNumber(string: string) {
  const matches = string.match(/\d+/);
  if (matches) return matches[0];
  return null;
}

export { isNumeric, extractNumber };
