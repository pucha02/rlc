import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { arrayIteration } from "../../common/utils/smallFn/iterateFn";

const Date = () => {
  let dateList = [
    { id: 1, name: "1" },
    { id: 2, name: "11" },
    { id: 3, name: "15" }
  ];

  let location = useLocation();
  let state = location.state || {};
  let { name } = state;

  return (
    <div>
      <h1>Виберіть дату</h1>
      {arrayIteration(dateList)}
      {console.log(state)}


      <Link to={`/teachers/${name}/teacherName`}>
        <div>Choose Teacher</div>
      </Link>

    </div>
  );
};

export default Date;
