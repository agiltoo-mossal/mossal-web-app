import { Course } from "src/graphql/generated";

export function getFirstLesson(course: Course
  ) {
  let lesson = null;
  course.modules.forEach(m => {
    m.lessons.forEach(l => {
      if(!lesson) {
        lesson = l;
        return;
      }
    })
    if(lesson) {
      return;
    }
  })
  return lesson;
}

export function getClassroomLink(course: Course) {
  const lesson = getFirstLesson(course);
  if(!lesson) {
    return `/talent/courses/${course.id}`;
  }
  return `/classroom/${ course.id }/lesson/${lesson.id}/${lesson.type.toLowerCase()}`;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  // Utilisez la méthode String.prototype.padStart() pour formater les heures et les minutes avec des zéros
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = remainingMinutes.toString().padStart(2, '0');

  return `${formattedHours} hr ${formattedMinutes} mins`;
}
