import prod from "./production/course-list"
import sample from "./sample/course-list"

const courseList = process.env.NODE_ENV === "development"
  ? [...prod, ...sample]
  : prod

export default courseList
