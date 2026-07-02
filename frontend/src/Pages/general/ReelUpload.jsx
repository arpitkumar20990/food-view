import React, { useState, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ReelUpload = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    video: '',
    description: '',
  })
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'video' && files && files[0]) {
      setFormData((prev) => ({ ...prev, video: files[0] }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("video", formData.video);

      const response = await axios.post(
        "http://localhost:3000/api/food",
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (err) {
        // Clear form fields and file input after successful upload
        if (fileInputRef.current) fileInputRef.current.value = ''
      console.log(err.response?.data || err.message);
    }
 setFormData(
  { name: '', 
    video: '', 
    description: '' 
  })

  navigate('/food-partner/home')
    
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8 sm:px-6 lg:px-8'>
      <div className='w-full max-w-5xl rounded-[28px] bg-white p-6 shadow-lg sm:p-8 lg:p-10'>
        <div className='mb-8 text-center lg:mb-10'>
          <h1 className='text-2xl font-bold text-gray-900 sm:text-3xl'>Create Food Reel</h1>
          <p className='mt-2 text-sm text-gray-600 sm:text-base'>Share your food story with a polished upload experience.</p>
        </div>

        <div className='grid gap-8 lg:grid-cols-[1.1fr_0.9fr]'>
          <div className='rounded-3xl border border-gray-200 bg-gray-50 p-5 sm:p-6'>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <label className='block'>
                <span className='mb-2 block text-sm font-medium text-gray-700'>Food Name</span>
                <input
                  type='text'
                  name='name'
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='e.g. Spicy Burger'
                  className='w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100'
                />
              </label>

              <label className='block'>
                <span className='mb-2 block text-sm font-medium text-gray-700'>Upload Video</span>
                <input
                  type='file'
                  name='video'
                  accept='video/*'
                  required
                  ref={fileInputRef}
                  onChange={handleChange}
                  className='w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-red-700 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                />
                {formData.video && typeof formData.video !== 'string' && (
                  <p className='mt-2 text-sm text-gray-600'>Selected: {formData.video.name}</p>
                )}
              </label>

              <label className='block'>
                <span className='mb-2 block text-sm font-medium text-gray-700'>Description</span>
                <textarea
                  name='description'
                  rows='4'
                  value={formData.description}
                  onChange={handleChange}
                  placeholder='Write a short description for your reel...'
                  className='w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100'
                />
              </label>


              <button
                type='submit'
                className='w-full cursor-pointer rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700'
              >
                Upload Reel
              </button>
            </form>
          </div>

          {/* <div className='rounded-3xl bg-gradient-to-br from-red-50 to-gray-100 p-5 sm:p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-lg font-semibold text-gray-900'>Preview</h2>
              <span className='rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600'>Live Preview</span>
            </div>

            <div className='overflow-hidden rounded-2xl border border-gray-200 bg-white'>
              <div className='aspect-video bg-gradient-to-br from-red-200 via-gray-200 to-gray-300' />
              <div className='space-y-3 p-4'>
                <div className='h-3 w-2/3 rounded-full bg-gray-300' />
                <div className='h-3 w-1/2 rounded-full bg-gray-200' />
                <div className='h-3 w-3/4 rounded-full bg-gray-300' />
              </div>
            </div>

            <div className='mt-5 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-600'>
              <p className='font-medium text-gray-900'>What this form collects</p>
              <ul className='mt-2 list-disc space-y-1 pl-5'>
                <li>Food name</li>
                <li>Video URL</li>
                <li>Description</li>
                <li>Food partner reference</li>
              </ul>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default ReelUpload