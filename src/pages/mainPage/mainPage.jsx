import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Backet from '../backet/backet';

// Lazy-loaded components
const Languages = lazy(() => import('../chooseLanguage/language'));
const Teachers = lazy(() => import('../chooseTeacher/teachers'));
const Date = lazy(() => import('../chooseDate/date'));
const Courses = lazy(() => import('../chooseCourse/courses'));
const UserProfile = lazy(() => import('../regPages/UserProfile'));

const MainPage = () => {
  return (
    <Router>
      <Backet />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Languages />} />
          <Route path=":name/:date/:teacherName" element={<Teachers />} />
          <Route path=":name/:date" element={<Date />} />
          <Route path="/teachers/:name/teacherName/:name" element={<Date />} />
          <Route path=":name" element={<Courses />} />
          <Route path="/cabinet" element={<UserProfile/>}></Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default MainPage;
