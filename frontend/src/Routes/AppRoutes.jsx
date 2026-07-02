import React from 'react'
import { Routes, Route } from 'react-router-dom'
import UserRegister from '../Pages/auth/UserRegister'
import UserLogin from '../Pages/auth/UserLogin'
import FoodPartnerRegister from '../Pages/auth/FoodPartnerRegister'
import FoodPartnerLogin from '../Pages/auth/FoodPartnerLogin'
import Home from '../Pages/general/Home'
import ReelUpload from '../Pages/general/ReelUpload'
import Profile from '../Pages/general/Profile'
import ChooseRegister from '../Pages/auth/ChooseRegister'
import Store from '../Pages/general/Store'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<ChooseRegister/>}/>
      <Route path='/user/register' element={<UserRegister />} />
      <Route path='/user/login' element={<UserLogin />} />
      <Route path='/food-partner/register' element={<FoodPartnerRegister />} />
      <Route path='/food-partner/login' element={<FoodPartnerLogin />} />
      <Route path='/home' element={<Home/>}/>
      <Route path='/create-food' element={<ReelUpload/>}/>
      <Route path="/food-partner/:id" element={<Store/>} />
      <Route path="/food-partner/home" element={<Profile/>} />
    </Routes>
  )
}

export default AppRoutes