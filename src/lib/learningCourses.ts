const LEARNING_COURSE_NAMES = [
  "Learn Gel polish with Basic arts",
  "Basic nail art Course",
] as const;

export function isLearningCourseName(name: string) {
  return LEARNING_COURSE_NAMES.some((courseName) => courseName.toLowerCase() === name.trim().toLowerCase());
}
