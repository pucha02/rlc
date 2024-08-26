import { arrayIteration } from "../../common/utils/smallFn/iterateFn";

const Courses = () => {
  let coursesList = ["A1", "A2", "B1", "B2", "C1", "C2"];
  return (
    <div>
      <h1>Виберіть курс</h1>
      {arrayIteration(coursesList)}
    </div>
  );
};

export default Courses;
