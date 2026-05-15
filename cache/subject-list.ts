import prod from "./production/subject-list"
import sample from "./sample/subject-list"

const subjectList = process.env.NODE_ENV === "development"
  ? sample
  : prod

export default subjectList
