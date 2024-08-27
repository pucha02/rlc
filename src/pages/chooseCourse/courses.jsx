import { arrayIteration } from "../../common/utils/smallFn/iterateFn";
import { useLocation } from "react-router-dom";

const Courses = () => {
  let coursesList = [
    {id:1, name: 'A1', lang: 'English'},
    {id:2, name: 'A2', lang: 'Spanish'},
    {id:3, name: 'B1', lang: 'Spanish'},
    {id:4, name: 'B2', lang: 'English'},
    {id:5, name: 'C1', lang: 'English'},
    {id:6, name: 'C2', lang: 'Spanish'}
  ];

  let state = useLocation().state


  return (
    <div>
      <h1>Виберіть курс</h1>
      {arrayIteration(coursesList)}
      {console.log(state)}
    </div>
  );
};

export default Courses;
