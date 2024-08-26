import { Link } from "react-router-dom";

export function arrayIteration(array) {
  return (
    <ul>
      {array.map((item) => (
        <li key={item.id}>
          <Link to={item.name} state={{ id: item.id }}>
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
