import prod from "./production/professor-list"
import sample from "./sample/professor-list"

const professorList = process.env.NODE_ENV === "development"
  ? sample
  : prod

export default professorList
