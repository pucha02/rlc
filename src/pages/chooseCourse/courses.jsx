import { ArrayIteration } from "../../common/utils/smallFn/iterateFn";
import { useLocation } from "react-router-dom";

const Courses = () => {
  let coursesList = [
    {id:1, level: 'A1', lang: 'English', tab: 'level'},
    {id:2, level: 'A2', lang: 'Spanish', tab: 'level'},
    {id:3, level: 'B1', lang: 'Spanish', tab: 'level'},
    {id:4, level: 'B2', lang: 'English', tab: 'level'},
    {id:5, level: 'C1', lang: 'English', tab: 'level'},
    {id:6, level: 'C2', lang: 'Spanish', tab: 'level'}
  ];

  let state = useLocation().state

  return (
    <div>
      <h1>Виберіть курс</h1>
      {ArrayIteration(coursesList, 'level', '/date')}
      {console.log(state)}
    </div>
  );
};

export default Courses;
