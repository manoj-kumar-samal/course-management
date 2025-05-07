import React, { useEffect, useState } from 'react'
import logo from "../../public/brand.jpg"
import { useFormik } from "formik";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BACKEND_URL } from '../utils/utils';

function AdminLogin() {
  const[errorMsg,setErrorMsg]=useState()

  let navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    onSubmit: async (value) => {
      try {
        const response=await axios.post(`${BACKEND_URL}/admin/login`, value)
        console.log(value)
        navigate("/admin/dashboard")
        toast.success("Login Successfull")
        localStorage.setItem("admin", JSON.stringify(response.data));
      } catch (error) {
        if (error.response) {
          setErrorMsg(error.response.data.errors);
        }
      }
    }
  })
  return (
    <div className='bg-gradient-to-r from-black to-blue-950 h-screen'>
      <div className='container text-white mx-auto'>
        
        <header className='flex justify-between items-center p-6'>
          <div className='flex items-center space-x-2'>
            <img src={logo} alt='' className='w-10 h-10 rounded-full'></img>
            <h1 className='text-2xl text-orange-500 font-bold'>LearnX</h1>
          </div>
          <div className='space-x-4'>
            <Link to="/admin/signup" className='bg-transparent text-white py-2 px-4 border border-white rounded'>Signup</Link>
            <button className='bg-orange-600 text-white py-2 px-4 rounded'>Join now</button>
          </div>
        </header>
        <div className='flex justify-center items-center h-100'>
          <div className='bg-gray-900 p-8 rounded-lg shadow-lg w-[400px] mt-20'>
            <div>
              <h2 className='text-2xl font-bold mb-4 text-center'>Welcome to <span className='text-orange-500'>LearnX</span></h2>
              <p className='text-center text-gray-400 mb-6'>Login to access admin dashboard!</p>

              <form onSubmit={formik.handleSubmit}>
                <dl>
                  <dt className='mt-2'>Email</dt>
                  <dd>
                    <input onChange={formik.handleChange} className='w-full p-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500' type='email' name='email' placeholder='Enter your email'></input>
                  </dd>
                  <dt className='mt-2'>Password</dt>
                  <dd>
                    <input onChange={formik.handleChange} className='w-full p-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500' type='password' name='password' placeholder='Enter your password'></input>
                  </dd>
                </dl>
                {errorMsg &&
                  <div className='mb-4 text-red-600 text-center'>
                    {errorMsg}
                  </div>}
                <button type='submit' className='bg-orange-600 cursor-pointer text-white w-full p-2 rounded mt-3'>Login</button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AdminLogin
