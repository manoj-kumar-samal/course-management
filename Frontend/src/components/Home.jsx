import React, { useEffect, useState } from 'react'
import logo from "../../public/brand.jpg"
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from 'react-hot-toast';
import { BACKEND_URL } from '../utils/utils.js';

function Home() {

    const [courses, setCourses] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("user")
        if (token) {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
    }, [])

    const handleLogout = async () => {
        try {
            const response = axios.get(`${BACKEND_URL}/user/logout`)
            toast.success((await response).data.message)
            setIsLoggedIn(false)
            localStorage.removeItem("user")
        } catch (error) {
            console.log("Error in logging out", error)
            toast.error(error.message.data.errors || "Error in logging")
        }
    }

    useEffect(() => {
        const fetchCourses = () => {
            try {
                axios.get(`${BACKEND_URL}/course/courses`)
                    .then(response =>
                        setCourses(response.data.courses)
                    )
            } catch (error) {
                console.log("Error in fetchCourse", error)
            }
        };
        fetchCourses();

    }, [])
    console.log(courses)

    var settings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
        cssEase: "ease-in-out",
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true
                }
            }
        ]
    };

    return (
        <div className='bg-gradient-to-r from-black to-blue-950 h-full'>
            <div className='container text-white mx-auto'>
              
                <header className='flex justify-between items-center p-6'>
                    <div className='flex items-center space-x-2'>
                        <img src={logo} alt='' className='w-10 h-10 rounded-full'></img>
                        <h1 className='text-2xl text-orange-500 font-bold'>LearnX</h1>
                    </div>
                    <div className='space-x-4'>
                        {isLoggedIn ? (
                            <button onClick={handleLogout} className='cursor-pointer bg-transparent text-white py-2 px-4 border border-white rounded'>Logout</button>
                        ) :
                            (<>
                                <Link to="/login" className='bg-transparent text-white py-2 px-4 border border-white rounded'>Login</Link>
                                <Link to="/signup" className='bg-transparent text-white py-2 px-4 border border-white rounded'>Signup</Link>
                            </>)
                        }
                    </div>
                </header>

             
                <section className='text-center py-15'>
                    <h1 className='text-4xl text-orange-500 font-bold'>LearnX</h1>
                    <br />
                    <p className='text-gray-500'>Sharpen your skills courses crafted by experts.</p>
                    <div className='space-x-4 mt-8'>
                        <Link to="/courses" className='bg-green-500 py-3 px-8 text-white rounded font-semibold hover:bg-white duration-300 hover:text-black'>Explore Courses</Link>
                        <Link to="" className='bg-white py-3 px-8 text-black rounded font-semibold hover:bg-green-500 duration-300 hover:text-white'>Courses Videos</Link>
                    </div>
                </section>
                <section>
                    <Slider {...settings}>
                        {
                            courses.map(items =>
                                <div key={items.id} className='p-2'>
                                    <div className='relative flex-shrink-0 w-75 transition-transform duration-300 transform hover:scale-105'>
                                        <div className='bg-gray-900 rounded-lg overflow-hidden'>
                                            <img className='h-20 w-full object-contain' src={items.image.url} alt=''></img>
                                            <div className='p-2 text-center'>
                                                <h2 className='text-xl font-bold text-white'>{items.title}</h2>
                                                <button className='mt-4 bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-blue-500 duration-300'>Enroll Now</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </Slider>
                </section>

                <hr />
              
                <footer className='mt-8 py-3'>
                    <div className='grid grid-cols-1 md:grid-cols-3'>
                        <div className='flex flex-col items-center'>
                            <div className='flex items-center space-x-2'>
                                <img src={logo} alt='' className='w-10 h-10 rounded-full'></img>
                                <h1 className='text-2xl text-orange-500 font-bold'>LearnX</h1>
                            </div>
                            <div className='mt-3 ml-2 md:ml-8 text-center'>
                                <p className='mb-2'>Follow us</p>
                                <div className='flex space-x-4'>
                                    <a className='hover:text-pink-400 text-2xl duration-300' href=''>
                                        <FaFacebook />
                                    </a>
                                    <a className='hover:text-pink-600 text-2xl duration-300' href=''>
                                        <FaTwitter />
                                    </a>
                                    <a className='hover:text-blue-600 text-2xl duration-300' href=''>
                                        <FaInstagram />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className='items-center flex flex-col'>
                            <h3 className='text-lg font-semibold mb-4'>Connects</h3>
                            <ul className='space-y-2 text-gray-400 text-center'>
                                <li className='hover:text-white duration-300 cursor-pointer'>youtube-just-code</li>
                                <li className='hover:text-white duration-300 cursor-pointer'>telegram-just-code</li>
                                <li className='hover:text-white duration-300 cursor-pointer'>Github-just-code</li>
                            </ul>
                        </div>
                        <div className='items-center flex flex-col'>
                            <h3 className='text-lg font-semibold mb-4'>Copyrights &#169; 2025</h3>
                            <ul className='space-y-2 text-gray-400 text-center'>
                                <li className='hover:text-white duration-300 cursor-pointer'>Terms & Conditions</li>
                                <li className='hover:text-white duration-300 cursor-pointer'>Privacy Policy</li>
                                <li className='hover:text-white duration-300 cursor-pointer'>Refund & Cancellation</li>
                            </ul>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default Home
