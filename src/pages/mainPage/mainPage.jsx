import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Languages = lazy(() => import('../chooseLanguage/language'));
const Teachers = lazy(() => import('../chooseTeacher/teachers'));
const Date = lazy(() => import('../chooseDate/date'));
const Courses = lazy(() => import('../chooseCourse/courses'));
const FinalPage = lazy(() => import('../testFinalPage/testFinalPage'));

const MainPage = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Languages />} />
          <Route path=":name" element={<Courses />} />
          <Route path=":name/:date" element={<Date />} />
          <Route path=":name/:date/:name" element={<Teachers />} />
          <Route path=':name/:date/:name/final' element={<FinalPage/>}/>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default MainPage;
