import { arrayIteration } from "../../common/utils/smallFn/iterateFn";

const Courses = () => {
  let coursesList = [
    {id:1, name: 'A1'},
    {id:2, name: 'A2'},
    {id:3, name: 'B1'},
    {id:4, name: 'B2'},
    {id:5, name: 'C1'},
    {id:6, name: 'C2'}
  ];
  return (
    <div>
      <h1>Виберіть курс</h1>
      {arrayIteration(coursesList)}
    </div>
  );
};

export default Courses;
