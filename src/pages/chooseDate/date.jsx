import { ArrayIteration } from "../../common/utils/smallFn/iterateFn";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Teachers from "../chooseTeacher/teachers";

const Date = () => {
  let dateList = [
    {id:1, date: "1", tab: 'date'},
    {id:2, date: "11", tab: 'date'},
    {id:3, date: "15", tab: 'date'}
  ];

  


  let state = useLocation().state
  let path = useLocation().pathname

  return (
    <div>
      <h1>Виберіть дату</h1>
      {ArrayIteration(dateList, 'date', '/teacher')}
      
      <Link to={'/teacher'}>
        <div>Choose Teacher</div>
      </Link>
    </div>
  );
};

export default Date;
