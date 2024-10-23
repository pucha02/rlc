import { Link } from "react-router-dom";
import handleClick from "./checkOnTeacher";
import { useNavigate } from "react-router-dom";


export function ArrayIteration(array, objectKey, path) {

  const navigate = useNavigate();

  return (
    <ul>
      {array.map((item) => (
        <li 
          key={item.id}>
          <Link to={path} state={item}>
            {item[objectKey]}
          </Link>
        </li>
      ))}
    </ul>
  );
}