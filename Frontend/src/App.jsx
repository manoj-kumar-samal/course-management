import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import { Toaster } from 'react-hot-toast';
import Courses from './components/Courses'
import Buy from './components/Buy'
import Purchase from './components/Purchase'
import AdminSignup from './admin/AdminSignup'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import CourseCreate from './admin/CourseCreate'
import OurCourses from './admin/OurCourses'
import UpdateCourse from './admin/UpdateCourse'
import UserProfile from './components/UserProfile'
import CourseDetailsWithReviews from './components/Reviews'

function App() {
  const user = JSON.parse(localStorage.getItem("user"))
  const admin = JSON.parse(localStorage.getItem("admin"));
  
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path="/profile" element={user ? <UserProfile/> : <Navigate to="/login"/>}></Route>
        <Route path="/courses" element={<Courses/>}></Route>
        <Route path='/buy/:courseId' element={<Buy/>}></Route>
        <Route path="/review/course/:courseId" element={<CourseDetailsWithReviews/>}></Route>
        <Route path='/purchase' element={user ? <Purchase/> : <Navigate to="/login"/>}></Route>
        <Route path="/admin/signup" element={<AdminSignup/>}></Route>
        <Route path='/admin/login' element={<AdminLogin/>}></Route>
        <Route path='/admin/dashboard' element={admin ? <AdminDashboard/> : <Navigate to="/admin/login"/>}></Route>
        <Route path="/admin/create-course" element={<CourseCreate/>}></Route>
        <Route path='/admin/courses' element={<OurCourses/>}></Route>
        <Route path='/admin/update/:id' element={<UpdateCourse/>}></Route>
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App