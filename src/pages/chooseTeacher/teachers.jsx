import { ArrayIteration } from "../../common/utils/smallFn/iterateFn";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ButtonNext from "../../common/components/buttonNext/buttonNext";

const Teachers = () => {
  let teacherList = [
    { id: 1, teacherName: 'Anna', lang: 'en', tab: 'teacher' },
    { id: 2, teacherName: 'Petro', lang: 'sp', tab: 'teacher' },
    { id: 3, teacherName: 'Klyim', lang: 'en', tab: 'teacher' },
    { id: 4, teacherName: 'Gwintivka', lang: 'sp', tab: 'teacher' },
  ];

  let state = useLocation().pathname;

  return (
    <div>
      <h1>Оберіть вчителя</h1>
      {ArrayIteration(teacherList, 'teacherName', '/final')}
      <ButtonNext />
      {console.log(state)}
    </div>
  );
};

export default Teachers;
