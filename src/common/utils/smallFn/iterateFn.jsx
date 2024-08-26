export function arrayIteration(array) {
  return (
    <ul>
      {array.map((item, index) => {
        return <li key={index}>{item}</li>;
      })}
    </ul>
  );
}
