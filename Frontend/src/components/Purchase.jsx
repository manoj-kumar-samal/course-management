import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaCircleUser, FaDiscourse, FaDownload } from "react-icons/fa6";
import { FaBars, FaTimes, FaUser } from "react-icons/fa"; // Fixed imports for toggle icons
import { RiHome2Fill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import toast from 'react-hot-toast';
import logo from "../../public/brand.jpg";
import { Link, useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../../utils/utils';

function Purchase() {
  const [purchase, setPurchase] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user?.token;

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      setLoading(false);
      setErrorMsg("Please login to view your purchases.");
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const fetchPurchases = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/user/purchases`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setPurchase(response.data.courseData || []);
        setFilteredPurchases(response.data.courseData || []);
        setErrorMsg('');
      } catch (error) {
        setErrorMsg(error?.response?.data?.errors || "Failed to fetch purchase data");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [token]);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredPurchases(purchase);
    } else {
      const filtered = purchase.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredPurchases(filtered);
    }
  }, [searchQuery, purchase]);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`);
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      toast.error("Error in logging out");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-700">
        <p className="text-xl">Loading purchases...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-700 text-white p-4">
        <h2 className="text-2xl font-semibold text-orange-400 mb-6">{errorMsg}</h2>
        <button
          onClick={() => navigate('/login')}
          className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded text-white transition"
        >
          Login Now
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-700 overflow-hidden">
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-screen bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-5 shadow-lg
        w-64
        transform
        transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between mb-10 mt-5 md:mt-10">
          <img src={logo} alt="Profile" className="rounded-full h-12 w-12 border-4 border-white" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white text-2xl"
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>
        <nav className='h-screen'>
          <ul className="space-y-4">
            <li>
              <Link onClick={() => setSidebarOpen(false)} to="/" className="flex items-center text-white hover:text-yellow-400">
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>
            <li>
              <Link onClick={() => setSidebarOpen(false)} to="/profile" className="flex items-center text-white hover:text-yellow-400">
                <FaUser className="mr-2" /> Profile
              </Link>
            </li>
            <li>
              <Link onClick={() => setSidebarOpen(false)} to="/courses" className="flex items-center text-white hover:text-yellow-400">
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>
            <li>
              <span className="flex items-center text-blue-300">
                <FaDownload className="mr-2" /> Purchases
              </span>
            </li>
            
            <li>
              <button onClick={handleLogout} className="flex items-center cursor-pointer text-white hover:text-yellow-400">
                <IoLogOut className="mr-2" /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 bg-white p-4 md:p-6 overflow-auto max-h-screen relative">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-700 text-white p-5 rounded-lg shadow-xl mb-6">
          <div className="flex items-center w-full md:w-auto justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">My Purchased Courses</h1>
            <button
              className="md:hidden ml-4 text-2xl"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <FaBars />
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 md:mt-0 w-full sm:w-auto">
            <div className="flex items-center bg-white rounded-full shadow-md border border-gray-300 w-full sm:w-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="bg-transparent text-gray-800 px-4 py-2 w-full sm:w-64 focus:outline-none rounded-l-full"
              />
              <FiSearch className="mx-3 text-gray-500" />
            </div>
            <FaCircleUser className="hidden md:text-3xl md:text-white md:hover:text-gray-300 md:transition" />
          </div>
        </header>

        <div className="overflow-y-auto max-h-[75vh]">
          {filteredPurchases.length === 0 ? (
            <div className="text-center mt-20">
              <h2 className="text-2xl font-semibold text-gray-500">No purchases yet.</h2>
              <button
                onClick={() => navigate('/courses')}
                className="mt-6 bg-green-500 hover:bg-green-600 px-6 py-3 rounded text-white transition"
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPurchases.map(course => (
                <div key={course._id} className="bg-white border border-gray-300 p-4 rounded-lg shadow-md hover:scale-[1.03] transition-transform">
                  <div className="h-48 w-full bg-gray-200 rounded-t-lg overflow-hidden relative">
                    <img
                      src={course.image?.url || "https://via.placeholder.com/300x150"}
                      alt={course.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-center mt-4">{course.title}</h2>
                    <p className="text-sm text-center text-gray-600 mt-2 h-10">
                      {course.description?.slice(0, 100)}...
                    </p>
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={() => navigate(`/courses/${course._id}`)}
                        className="w-full px-4 py-2 text-sm bg-teal-500 text-white rounded-lg hover:bg-teal-400 transition"
                      >
                        View Course
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Purchase;
