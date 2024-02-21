import { CourseStatus } from "src/graphql/generated";

export const colorByStatus = {
  [CourseStatus.AvailableForPreview]: "#FCD980",
  [CourseStatus.RegistrationOpen]: "#3CB14F",
  [CourseStatus.Draft]: "#B2B3CF",
  [CourseStatus.End]: "#FB6D3A"
}
