import { useState, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../config'

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
      const data = new FormData()

      data.append('name', formData.name)
      data.append('description', formData.description)
      data.append('video', formData.video)

      await axios.post(`${API_BASE_URL}/api/food`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setFormData({ name: '', video: '', description: '' })
      if (fileInputRef.current) fileInputRef.current.value = ''
      navigate('/food-partner/home')
    } catch (err) {
      console.log(err.response?.data || err.message)
    }
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
        </div>
      </div>
    </div>
  )
}

export default ReelUpload