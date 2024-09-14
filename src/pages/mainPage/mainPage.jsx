import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Backet from '../backet/backet';

const SchoolDetailWrapper = lazy(() => import('../../services/AdminPanel/data_school/SchoolDetail/SchoolDetailWrapper'));
const AdminWrapper = lazy(() => import('../../services/AdminPanel/teacher_schedule/TeacherList/AdminWrapper'));
const LanguagesWrapper = lazy(() => import('../chooseLanguage/LanguagesWrapper'));
const Courses = lazy(() => import('../chooseCourse/courses'));
const Date = lazy(() => import('../chooseDate/date'));
const LessonTypes = lazy(() => import('../chooseLessonTypes/lessonTypes'));
const Teachers = lazy(() => import('../chooseTeacher/teachers'));
const FinalPage = lazy(() => import('../testFinalPage/testFinalPage'));
const UserProfile = lazy(() => import('../regPages/UserProfile'));
const BookingList = lazy(() => import('../../services/AdminPanel/teacher_schedule/BookingList/BookingList'));
const AddBookingForm = lazy(() => import('../../services/AdminPanel/teacher_schedule/AddBookingForm/AddBookingForm'));
const EditBookingForm = lazy(() => import('../../services/AdminPanel/teacher_schedule/EditBookingForm/EditBookingForm'));
const TeacherList = lazy(() => import('../../services/AdminPanel/teacher_schedule/TeacherList/TeacherList'));
const SchoolDetail = lazy(() => import('../../services/AdminPanel/data_school/SchoolDetail/SchoolDetail'));
const SchoolList = lazy(() => import('../../services/AdminPanel/create_school/SchoolList'));
const LanguagesList = lazy(() => import('../../services/AdminPanel/teacher_schedule/LanguageList/LanguagesList'));
const LevelList = lazy(() => import('../../services/AdminPanel/teacher_schedule/LevelList/LevelsList'));
const TypeLessonList = lazy(() => import('../../services/AdminPanel/teacher_schedule/TypeLessonList/TypeLessonList'));

const MainPage = () => {
  localStorage.setItem('data', '{}');
  localStorage.setItem('selectedDates', '{}');

  return (
    <Router>
      <Backet />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/:id" element={<LanguagesWrapper />} />
          <Route path="/course" element={<Courses />} />
          <Route path="/date" element={<Date />} />
          <Route path="/lessoTypes" element={<LessonTypes />} />
          <Route path="/teacher" element={<Teachers />} />
          <Route path="/final" element={<FinalPage />} />
          <Route path="/cabinet" element={<UserProfile />} />
          <Route path="/:id/admin" element={<AdminWrapper />} />
          <Route path="/:id/admin/school-detail" element={<SchoolDetailWrapper />} />
          <Route path="/admin/school-list" element={<SchoolList />} />
          <Route path="/add-booking" element={<AddBookingForm />} />
          <Route path="/bookinglist" element={<BookingList />} />
          <Route path="/typeLessonList" element={<TypeLessonList />} />
          <Route path="/edit-booking/:id" element={<EditBookingForm />} />
          <Route path="/languageslist" element={<LanguagesList />} />
          <Route path="/levelList" element={<LevelList />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default MainPage;
