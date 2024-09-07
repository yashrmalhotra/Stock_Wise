import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  
  return (
    <>
    
      <header className='bg-blue-700 w-full h-[55px] text-white text-2xl flex items-center font-bold px-5'>
        <span><img src="/images/inventory.png" width={"24px"} height={"24px"} alt="" /></span>
        <span className='text-orange-300'>S</span>tock<span className='text-black'>W</span>ise
      </header>
      <main className='border w-full min-h-[93vh] bg-slate-300 p-2'>
        
          <h1 className='text-3xl font-bold text-center'>Welcome to StockWise - An Inventory Management tool</h1>
          <section className='product-info my-5 flex justify-center'>
            <p className="text-xl font-medium text-center w-1/2">Our inventory management tool provide a comprehensive solution to keep track of stock. It is user friendly interface, it ensures that you have the most accurate informationat your fingertips.</p>
          </section>

        <section className='btngroup flex justify-center my-20 gap-3 '>

          <Link to="/login"><button type="button" class="bg-gradient-to-r from-purple-500 to-red-500 active:bg-gradient-to-l p-3 w-24">Login</button></Link>
          <Link to="/signup"><button type="button" class="bg-gradient-to-r from-purple-500 to-red-500 active:bg-gradient-to-l p-3 w-24">Sign up</button></Link>
        </section>

        <section className='additional-info flex justify-center'>
          <p className='text-xl font-medium text-center w-1/2'>
            After logging in you'll able to access detailed report, manage your inventory more effectively, and take advantage of advanced features tailored to your business need. 
          </p>
        </section>

      </main>
    </>
  )
}

export default Home
