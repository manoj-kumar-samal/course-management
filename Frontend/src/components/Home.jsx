import React, { useEffect, useState } from 'react'
import logo from "../../public/brand.jpg"
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa"
import axios from "axios"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import toast from 'react-hot-toast'

function Home() {
    const [courses, setCourses] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [enrollFormOpen, setEnrollFormOpen] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' })

    useEffect(() => {
        const token = localStorage.getItem("user")
        setIsLoggedIn(!!token)
    }, [])

    const handleLogout = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:4001/api/v1/user/logout`)
            toast.success(response.data.message)
            setIsLoggedIn(false)
            localStorage.removeItem("user")
        } catch (error) {
            console.log("Error in logging out", error)
            toast.error(error.response?.data?.error || "Error in logging out")
        }
    }

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:4001/api/v1/course/courses`)
                setCourses(response.data.courses)
            } catch (error) {
                console.log("Error fetching courses", error)
            }
        }
        fetchCourses()
    }, [])

    const openEnrollForm = (course) => {
        setSelectedCourse(course)
        setEnrollFormOpen(true)
    }

    const handleFormChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        if (!formData.name || !formData.email || !formData.phone) {
            toast.error("Please fill all fields")
            return
        }

        try {
            await axios.post("http://127.0.0.1:4001/api/v1/email/send-email", {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
            })
            toast.success("Enrollment request sent! We'll contact you soon.")
            setEnrollFormOpen(false)
            setFormData({ name: '', email: '', phone: '' })
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to send enrollment")
        }
    }

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
            { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
            { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
        ]
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-700 text-white">
            <div className="container mx-auto px-4 py-6">

                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
                    <div className="flex items-center space-x-3">
                        <img src={logo} alt="LearnX Logo" className="w-12 h-12 rounded-full border-2 border-white" />
                        <h1 className="text-3xl font-bold tracking-wide text-yellow-400">LearnX</h1>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="bg-transparent border border-white hover:bg-white hover:text-indigo-700 transition px-5 py-2 rounded font-semibold w-40 text-center"
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="bg-transparent border border-white hover:bg-white hover:text-indigo-700 transition px-5 py-2 rounded font-semibold w-40 text-center"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-transparent border border-white hover:bg-white hover:text-indigo-700 transition px-5 py-2 rounded font-semibold w-40 text-center"
                                >
                                    Signup
                                </Link>
                            </>
                        )}
                    </div>
                </header>

                {/* Hero Section */}
                <section className="text-center mb-16 px-2">
                    <h2 className="text-4xl sm:text-5xl font-extrabold mb-3 text-yellow-400">Sharpen Your Skills</h2>
                    <p className="text-gray-200 max-w-xl mx-auto mb-8">Courses crafted by experts to boost your career and knowledge.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/courses"
                            className="bg-teal-600 hover:bg-teal-700 px-8 py-3 rounded-full font-semibold transition text-center"
                        >
                            Explore Courses
                        </Link>
                        <Link
                            to="#"
                            className="bg-white text-indigo-700 hover:bg-indigo-700 hover:text-white px-8 py-3 rounded-full font-semibold transition text-center"
                        >
                            Course Videos
                        </Link>
                    </div>
                </section>

                {/* Courses Slider */}
                <section>
                    <Slider {...settings}>
                        {courses.map(course => (
                            <div key={course._id} className="px-2">
                                <div className="bg-gradient-to-br from-indigo-800 via-blue-700 to-teal-700 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transform transition duration-300 cursor-pointer">
                                    <img
                                        src={course.image.url}
                                        alt={course.title}
                                        className="h-40 w-full object-cover"
                                    />
                                    <div className="p-4 text-center">
                                        <h3 className="text-lg font-semibold text-white truncate">{course.title}</h3>
                                        <button
                                            onClick={() => openEnrollForm(course)}
                                            className="mt-3 bg-yellow-400 hover:bg-yellow-500 text-indigo-900 font-semibold py-2 px-6 rounded-full transition shadow-md"
                                        >
                                            Enroll Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </section>

                {/* Enrollment Form Modal */}
                {enrollFormOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full text-gray-900">
                            <h2 className="text-xl font-semibold mb-4">Enroll in {selectedCourse.title}</h2>
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div>
                                    <label className="block mb-1 font-medium">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleFormChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleFormChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setEnrollFormOpen(false)}
                                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded bg-yellow-400 hover:bg-yellow-500 text-indigo-900 font-semibold"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <hr className="my-12 border-yellow-400/50" />
            </div>

            {/* Footer */}
            <footer className='mt-8 py-3'>
                <div className='grid grid-cols-1 md:grid-cols-3'>
                    <div className='flex flex-col items-center'>
                        <div className='flex items-center space-x-2'>
                            <img src={logo} alt='' className='w-10 h-10 rounded-full'></img>
                            <h1 className='text-2xl text-yellow-400 font-bold'>LearnX</h1>
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
                    <div className='items-center flex flex-col mt-6 md:mt-0'>
                        <h3 className='text-lg  text-yellow-400 font-semibold mb-4'>Connects</h3>
                        <ul className='space-y-2 text-gray-400 text-center'>
                            <li className='text-white duration-300 cursor-pointer'>youtube-just-code</li>
                            <li className='text-white duration-300 cursor-pointer'>telegram-just-code</li>
                            <li className='text-white duration-300 cursor-pointer'>Github-just-code</li>
                        </ul>
                    </div>
                    <div className='items-center flex flex-col mt-6 md:mt-0'>
                        <h3 className='text-lg  text-yellow-400 font-semibold mb-4'>Copyrights &#169; 2025</h3>
                        <ul className='space-y-2 text-gray-400 text-center'>
                            <li className='text-white duration-300 cursor-pointer'>Terms & Conditions</li>
                            <li className='text-white duration-300 cursor-pointer'>Privacy Policy</li>
                            <li className='text-white duration-300 cursor-pointer'>Refund & Cancellation</li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Home
