import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../config'

const UserLogin = () => {
    const navigate = useNavigate();

    const submitHandler = async(e)=>{
      e.preventDefault()

      const email = e.target.email.value
      const password = e.target.password.value

      const response = await axios.post(`${API_BASE_URL}/api/auth/user/login`,{
        email,
        password
      },{
        withCredentials : true
      })

    

      window.location.replace('/home')

    }

  return (
     <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='w-full max-w-sm justify-center rounded-3xl bg-white shadow-lg p-10'>
        <h1 className='text-3xl font-bold text-gray-900 text-center mb-10'> User Login</h1>

        <form onSubmit={submitHandler}>
        <div className='space-y-4 '>

          <label className='block'>
            <span className='text-lg font-medium text-gray-700'>Email</span>
            <input
              name='email'
              type='email'
              placeholder='Enter your email'
              className='mt-2 w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900'
            />
          </label>

          <label className='block'>
            <span className='text-lg font-medium text-gray-700'>Password</span>
            <input
            name='password'
              type='password'
              placeholder='Enter your password'
              className='mt-2 w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900'
            />
          </label>
        </div>

        <button
          
          type='submit'
          className='mt-6 w-full rounded-2xl bg-red-600 px-4 py-3 text-md font-semibold text-white shadow-sm transition hover:bg-red-700 cursor-pointer'
        >
          Login
        </button>
        </form>
      </div>
    </div>
  )
}

export default UserLogin    