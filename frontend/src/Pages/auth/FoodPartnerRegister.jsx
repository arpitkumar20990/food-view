import React from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
const FoodPartnerRegister = () => {

  const navigate = useNavigate()
  const submitHandler = async (e) => {
    e.preventDefault()

    const name = e.target.bussinessName.value
    const email = e.target.email.value
    const password = e.target.password.value
    const address = e.target.address.value

    const response = await axios.post("http://localhost:3000/api/auth/food-partner/register", {
      name,
      email,
      password,
      address
    },
      { withCredentials: true }
    )

    navigate(`/food-partner/home/${response.data.foodPartner._id}`)

  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='w-full max-w-sm justify-center rounded-3xl bg-white shadow-lg p-10'>
        <h1 className='text-2xl font-bold text-gray-900 text-center mb-10'>Register Food-Partner</h1>
        <form onSubmit={submitHandler}>
          <div className='space-y-4 '>
            <label className='block'>
              <span className='text-lg font-medium text-gray-700'>Bussiness Name</span>
              <input
                name='bussinessName'
                type='text'
                placeholder='Enter your bussiness name'
                className='mt-2 w-full border border-gray-300 bg-gray-50 px-4 py-3 rounded-2xl text-sm text-gray-900'
              />
            </label>

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

            <label className='block'>
              <span className='text-lg font-medium text-gray-700'>Address</span>
              <input
                name='address'
                type='text'
                placeholder='Enter your Address'
                className='mt-2 w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900'
              />
            </label>
          </div>

          <button
            type='submit'
            className='mt-6 w-full rounded-2xl bg-red-600 px-4 py-3 text-md font-semibold text-white shadow-sm transition hover:bg-red-700 cursor-pointer'
          >
            Register
          </button>
        </form>

        <div className="mt-8 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/food-partner/login"
            className="text-orange-500 hover:text-orange-600 font-semibold"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FoodPartnerRegister