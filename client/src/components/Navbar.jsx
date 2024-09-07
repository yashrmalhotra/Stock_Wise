import { NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { FaBars } from "react-icons/fa6";
import { useState, React } from 'react';
import { RxCrossCircled } from "react-icons/rx";
const api = import.meta.env.VITE_API_URL
const Navbar = () => {
  const [visible, setVisible] = useState(false)
  const logout = async ()=>{
     await fetch(`api/user/logout`,{credentials:"include"})
     window.location.reload()
  }

  return (
    <>
      <div className={`bg-white w-[15vw] fixed top-0 z-10 h-screen transition-transform duration-300 ${visible ? `translate-x-[0vw]` : `-translate-x-[15vw]`}`}>
        <button onClick={() => { setVisible(false) }} className='absolute top-5 right-2'>
          <RxCrossCircled size={45} />
        </button>
        <ul className='my-20'>
        <Link to="/dashboard"> <li className='hover:bg-gray-200 p-2 border-[2px]  border-slate-200 cursor-pointer my-[1px] w-full'>Dashboard</li></Link>
        <Link to="/billing"> <li className='hover:bg-gray-200 p-2 border-[2px]  border-slate-200 cursor-pointer my-[1px] w-full'>Billing</li></Link>
        <Link to="/billing/addbuyer"> <li className='hover:bg-gray-200 p-2 border-[2px]  border-slate-200 cursor-pointer my-[1px] w-full'>Add Buyer</li></Link>
        <Link to="/profile"> <li className='hover:bg-gray-200 p-2 border-[2px]  border-slate-200 cursor-pointer my-[1px] w-full'>Profie</li></Link>

        <button onClick={logout} className='absolute bottom-3 w-full bg-red-700 hover:bg-red-800 p-2 border-[2px] text-white border-slate-200'>Logout</button>
        </ul>

      </div>
      <nav className='bg-blue-700 w-[100vw] h-[55px] text-white text-2xl px-2 box-border flex items-center font-bold justify-between'>
        <div className="flex items-center">
          <button className='bg-blue-300 h-[20px] px-[2px] mx-2' onClick={() => { setVisible(true) }}><FaBars size={15} /></button>
          <NavLink to="/">
            <div className='flex items-center'>
              <span><img src="/images/inventory.png" width={"24px"} height={"24px"} alt="" /></span>
              <span className='text-orange-300'>S</span>tock<span className='text-black'>W</span>ise
            </div>
          </NavLink>
        </div>



      </nav>
    </>
  )
}

export default Navbar

