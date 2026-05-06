export const sanitizeText = (value: string): string =>
  value.replace(/[<>]/g, '').trim();

export const requireLength = (value: string, min: number, max: number): boolean => {
  const trimmed = value.trim();
  return trimmed.length >= min && trimmed.length <= max;
};
