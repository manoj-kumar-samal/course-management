import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OurCourses from './OurCourses'
import toast from 'react-hot-toast';
import axios from 'axios';
import { BACKEND_URL } from '../utils/utils';

function AdminDashboard() {
  const stats = [
    { title: 'Total Users', value: 1200 },
    { title: 'Total Courses', value: 35 },
    { title: 'Orders Today', value: 18 },
    { title: 'Revenue (INR)', value: '₹42,000' }
  ]

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/logout`);
      toast.success(response.data.message);
      setIsLoggedIn(false);
      localStorage.removeItem("admin");
      navigate("/admin/login");
    } catch (error) {
      console.log("Error in logging out", error);
      toast.error("Error in logging out");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      
      <aside className="w-64 bg-white shadow-md px-6 py-8 hidden md:flex flex-col">
        <h2 className="text-2xl font-bold text-blue-600 mb-8">Admin Panel</h2>
        <nav className="flex flex-col space-y-4">
          <Link to="/admin/dashboard" element={<AdminDashboard />} className="block text-gray-700 hover:text-blue-600">Dashboard</Link>
          <Link to="/admin/courses" element={<OurCourses />} className="block text-gray-700 hover:text-blue-600">Courses</Link>
          <Link to="/admin/signup" className="block text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/admin/create-course" href="#" className="block text-gray-700 hover:text-blue-600">Create Course</Link>
          <a onClick={handleLogout} href="#" className="block text-gray-700 hover:text-blue-600">Logout</a>
        </nav>
      </aside>

     
      <main className="flex-1 p-6">
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, Admin 👋</h1>
          <p className="text-gray-500">Here's an overview of your platform</p>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-5 rounded-lg shadow text-center">
              <h3 className="text-lg font-medium text-gray-700">{stat.title}</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
          <p className="text-gray-500">This section can show recent user activity, purchases, or updates.</p>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
