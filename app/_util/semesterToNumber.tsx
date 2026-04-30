export function semesterToNumber(semester: string): number {
  const [term, year] = semester.split(/[_-]/);
  const termOrder: Record<string, number> = { spring: 1, summer: 2, fall: 3 };
  return parseInt(year) * 10 + (termOrder[term] ?? 0);
}
