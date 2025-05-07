import axios from 'axios';
import React, { useEffect, useState } from 'react';
import logo from "../../public/brand.jpg"
import { FaCircleUser } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from '../utils/utils.js';

function Courses() {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');  // State to hold the search query
    let navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("user");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/user/logout`);
            toast.success(response.data.message);
            setIsLoggedIn(false);
            localStorage.removeItem("user");
            navigate("/");
        } catch (error) {
            console.log("Error in logging out", error);
            toast.error("Error in logging out");
        }
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/course/courses`);
                setCourses(response.data.courses);
                setFilteredCourses(response.data.courses);  // Initialize filteredCourses with all courses
            } catch (error) {
                console.log("Error fetching courses", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        // Filter courses based on search query
        const filtered = courses.filter(course =>
            course.title.toLowerCase().includes(query.toLowerCase())  // Case-insensitive search
        );
        setFilteredCourses(filtered);  // Update filtered courses
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-700 h-screen">

           
            <div className="w-20 md:w-64 bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-5 shadow-lg z-20">
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
                            <span className="flex items-center text-blue-300 hover:text-white">
                                <FaDiscourse className="mr-2" /> Courses
                            </span>
                        </li>
                        <li className="mb-4">
                            <Link to="/purchase" className="flex items-center text-white hover:text-yellow-400">
                                <FaDownload className="mr-2" /> Purchases
                            </Link>
                        </li>
                        <li className="mb-4">
                            <span className="flex items-center text-white hover:text-yellow-400">
                                <IoMdSettings className="mr-2" /> Settings
                            </span>
                        </li>
                        <li>
                            {isLoggedIn ? (
                                <Link to="/" onClick={handleLogout} className="flex items-center text-white hover:text-yellow-400">
                                    <IoLogOut className="mr-2" /> Logout
                                </Link>
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
                    <h1 className="text-3xl font-bold text-gray-100">Courses</h1>
                    <div className="flex items-center space-x-3">
                        
                        <div className="flex items-center bg-white rounded-full overflow-hidden shadow-md border border-gray-300">
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchQuery} 
                                onChange={handleSearchChange}
                                className="border-none bg-transparent focus:outline-none w-64 p-2 rounded-l-full text-gray-800"
                            />
                            <button className="h-10 border-l border-gray-300 px-4 flex items-center justify-center rounded-r-full cursor-pointer text-white">
                                <FiSearch className="text-xl text-gray-600" />
                            </button>
                        </div>
                        <FaCircleUser className="text-4xl text-teal-600 hover:text-teal-500 transition-all" />
                    </div>
                </header>

              
                <div className="overflow-y-auto max-h-[75vh]">
                    {loading ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : filteredCourses.length === 0 ? (
                        <p className="text-center text-gray-500">No courses found.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                            {filteredCourses.map(course => (
                                <div key={course._id} className="bg-white border border-gray-300 p-4 rounded-lg shadow-md hover:scale-105 hover:rotate-2 transform transition duration-300 ease-in-out">
                                    <div className="h-48 w-full bg-gray-200 rounded-t-lg overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-40"></div>
                                        <img src={course.image.url} alt={course.title} className="object-cover w-full h-full z-10" />
                                    </div>
                                    <div className="z-20 relative">
                                        <h2 className="text-lg font-semibold text-center mt-4">{course.title}</h2>
                                        <p className="text-sm text-center text-gray-600 mt-2">{course.description}</p>
                                        <div className="text-center text-green-500 font-semibold text-lg mt-2">
                                            <span className="bg-green-200 text-green-700 px-2 py-1 rounded-full">
                                                &#8377; {course.price}
                                            </span>
                                        </div>
                                        <div className="flex justify-center mt-4">
                                            <Link to={`/buy/${course._id}`} className="text-center w-full px-4 py-2 text-sm bg-teal-500 text-white rounded-lg hover:scale-110 transition hover:bg-teal-400">
                                                Buy Now
                                            </Link>
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

export default Courses;
