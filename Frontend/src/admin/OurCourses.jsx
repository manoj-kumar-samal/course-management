import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { BACKEND_URL } from '../utils/utils';

function OurCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const admin = JSON.parse(localStorage.getItem('admin'));
  const token = admin?.token;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`);
        setCourses(response.data.courses);
      } catch (error) {
        toast.error("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleDeleteCourse = async (id) => {
    try {
      const response = await axios.delete(`${BACKEND_URL}/course/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      toast.success(response.data.message);
      setCourses((prev) => prev.filter((course) => course._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error deleting course");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-700">
        <p className="text-white text-lg font-medium">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Our Courses</h1>
          <Link
            to="/admin/dashboard"
            className="bg-orange-500 hover:bg-orange-400 text-white text-sm px-4 py-2 rounded-md shadow-md transition"
          >
            Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 animate-fadeUp"
            >
              <div className="relative h-40 overflow-hidden rounded-t-lg">
                <img
                  src={course?.image?.url}
                  alt={course.title}
                  className="object-cover object-center w-full h-full transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="p-3">
                <h2 className="text-md font-semibold text-gray-800 truncate">{course.title}</h2>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                  {course.description.length > 90
                    ? course.description.slice(0, 90) + '...'
                    : course.description}
                </p>

                <div className="flex justify-between items-center text-xs mt-3 text-gray-700">
                  <span>₹{course.price}</span>
                  <span className="text-green-600 text-xs">10% off</span>
                </div>

                <div className="flex justify-between mt-3">
                  <Link
                    to={`/admin/update/${course._id}`}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1 rounded-md"
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => handleDeleteCourse(course._id)}
                    className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes fadeUp {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeUp {
            animation: fadeUp 0.4s ease-out;
          }
        `}
      </style>
    </div>
  );
}

export default OurCourses;
