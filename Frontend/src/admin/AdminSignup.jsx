import React, { useState } from 'react'
import logo from "../../public/brand.jpg"
import {useFormik} from "formik";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BACKEND_URL } from '../../utils/utils';


function AdminSignup() {
  const[errorMsg,setErrorMsg]=useState("")

  let navigate=useNavigate()

  const formik= useFormik({
    initialValues:{
      firstName:"",
      lastName:"",
      email:"",
      password:""
    },
    onSubmit:async (value)=>{
      try{
        await axios.post(`${BACKEND_URL}/admin/signup`,value)
        console.log(value)
        toast.success("Signup Successfull")
        navigate("/admin/login")
      }catch(error){
        if(error.response){
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
            <Link to="/admin/login" className='bg-transparent text-white py-2 px-4 border border-white rounded'>Login</Link>
            <button className='bg-orange-600 text-white py-2 px-4 rounded'>Join now</button>
          </div>
        </header>
        <div className='flex justify-center items-center h-100'>
          <div className='bg-gray-900 p-8 rounded-lg shadow-lg w-[400px] mt-20'>
            <div>
              <h2 className='text-2xl font-bold mb-4 text-center'>Welcome to <span className='text-orange-500'>LearnX</span></h2>
              <p className='text-center text-gray-400 mb-6'>Just Signup To Join  Us!</p>

              <form onSubmit={formik.handleSubmit}>
                <dl>
                  <dt>First Name</dt>
                  <dd>
                    <input onChange={formik.handleChange} className='w-full p-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500' type='text' name='firstName' placeholder='Enter First Name'></input>
                  </dd>
                  <dd></dd>
                  <dt className='mt-2'>Last Name</dt>
                  <dd>
                    <input onChange={formik.handleChange} className='w-full p-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500' type='text' name='lastName' placeholder='Enter Last Name'></input>
                  </dd>
                  <dt className='mt-2'>Email</dt>
                  <dd>
                    <input onChange={formik.handleChange} className='w-full p-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500' type='email' name='email' placeholder='Enater your email'></input>
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
                <button type='submit' className='bg-orange-600 cursor-pointer text-white w-full p-2 rounded mt-3'>Signup</button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AdminSignup
