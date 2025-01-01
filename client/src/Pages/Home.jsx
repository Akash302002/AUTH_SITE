import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

const Home = () => {
  return (
    <div className='flex flex-col justify-center items-center'>
        <Navbar></Navbar>
        <Header></Header>
    </div>
  )
}

export default Home