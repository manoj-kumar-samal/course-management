import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaCircleUser, FaDiscourse, FaDownload } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import toast from 'react-hot-toast';
import logo from "../../public/brand.jpg";
import { Link, useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../utils/utils.js';

function Purchase() {
  const [purchase, setPurchase] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token=user.token;
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      setErrorMsg("Please login to view your purchases.");
    }
  }, []);

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

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!token) return;
      try {
        const response = await axios.get("http://127.0.0.1:4001/api/v1/user/purchases", {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
        setPurchase(response.data.courseData || []);
        setFilteredPurchases(response.data.courseData || []);
      } catch (error) {
        setErrorMsg(error?.response?.data?.errors || "Failed to fetch purchase data");
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
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPurchases(filtered);
    }
  }, [searchQuery, purchase]);

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-700">
      {/* Sidebar */}
      <div className="w-20 md:w-64 bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-5 shadow-lg">
        <div className="flex items-center mb-10 mt-10">
          <img src={logo} alt="Profile" className="rounded-full h-12 w-12 border-4 border-white" />
        </div>
        <nav>
          <ul>
            <li className="mb-4">
              <Link to="/" className="flex items-center text-white hover:text-yellow-400">
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/courses" className="flex items-center text-white hover:text-yellow-400">
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>
            <li className="mb-4">
              <span className="flex items-center text-blue-300">
                <FaDownload className="mr-2" /> Purchases
              </span>
            </li>
            <li className="mb-4">
              <span className="flex items-center text-white hover:text-yellow-400">
                <IoMdSettings className="mr-2" /> Settings
              </span>
            </li>
            <li>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="flex items-center text-white hover:text-yellow-400">
                  <IoLogOut className="mr-2" /> Logout
                </button>
              ) : (
                <Link to="/login" className="flex items-center text-white hover:text-yellow-400">
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>

      
      <main className="flex-1 bg-white p-2 overflow-auto">
       
        <header className="flex justify-between items-center bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-700 text-white p-5 rounded-lg shadow-xl mb-8">
          <h1 className="text-3xl font-bold text-white">My Purchased Courses</h1>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-white rounded-full overflow-hidden shadow-md border border-gray-300">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="border-none bg-transparent focus:outline-none w-64 p-2 rounded-l-full text-gray-800"
              />
              <button className="h-10 border-l border-gray-300 px-4 flex items-center justify-center rounded-r-full cursor-pointer text-white">
                <FiSearch className="text-xl text-gray-600" />
              </button>
            </div>
            <FaCircleUser className="text-4xl text-teal-600 hover:text-teal-500 transition-all" />
          </div>
        </header>

        
        {!isLoggedIn ? (
          <div className="text-center mt-20">
            <h2 className="text-2xl font-semibold text-orange-500">{errorMsg}</h2>
            <button
              onClick={() => navigate('/login')}
              className="cursor-pointer mt-6 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded text-white transition"
            >
              Login Now
            </button>
          </div>
        ) : filteredPurchases.length === 0 ? (
          <div className="text-center mt-20">
            <h2 className="text-2xl font-semibold text-gray-500">No purchases yet.</h2>
            <button
              onClick={() => navigate('/courses')}
              className="cursor-pointer mt-6 bg-green-500 hover:bg-green-600 px-6 py-3 rounded text-white transition"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {filteredPurchases.map(course => (
              <div key={course._id} className="bg-white border border-gray-300 p-4 rounded-lg shadow-md hover:scale-105 hover:rotate-1 transform transition duration-300 ease-in-out">
                <div className="h-48 w-full bg-gray-200 rounded-t-lg overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-40"></div>
                  <img src={course.image?.url || "https://via.placeholder.com/300x150"} alt={course.title} className="object-cover w-full h-full z-10" />
                </div>
                <div className="z-20 relative">
                  <h2 className="text-lg font-semibold text-center mt-4">{course.title}</h2>
                  <p className="text-sm text-center text-gray-600 mt-2">{course.description?.slice(0, 100)}...</p>
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => navigate(`/courses/${course._id}`)}
                      className="cursor-pointer text-center w-full px-4 py-2 text-sm bg-teal-500 text-white rounded-lg hover:scale-110 transition hover:bg-teal-400"
                    >
                      View Course
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Purchase;
