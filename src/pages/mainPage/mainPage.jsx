
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { lazy } from "react";
import { useState } from "react";
var i = 0
const MainPage = () => {
  const Languages = lazy(() => import("../chooseLanguage/language"))
  const Teachers = lazy(() => import("../chooseTeacher/teachers"))
  const Date = lazy(() => import("../chooseDate/date"))
  const Courses = lazy(() => import("../chooseCourse/courses"))

  const [component, setComponent] = useState(null);

  const arr = [<Languages />, <Teachers/>, <Date/>, <Courses/>]


  const switchTab = () => {
    setComponent(arr[i])
    i++
  }

  return (
    <div>
      <p>MainPage</p>
      <Suspense fallback={<div>Loading...</div>}>
        {Languages}
        {component}
      </Suspense>
      <button onClick={switchTab}>Next</button>
    </div>
  );
};

export default MainPage;