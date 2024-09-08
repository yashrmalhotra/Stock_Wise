import React, { useEffect, useState } from 'react'
import "../App.css"
import { useNavigate } from 'react-router-dom'
import { IoEyeOff } from 'react-icons/io5'
import { IoIosEye } from "react-icons/io"

const Login = (props) => {
  let navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  useEffect(() => {

    let keysArray = Object.keys(props.user)

    if (keysArray.includes("loggedIn")) {
      navigate("/dashboard")
    }
  }, [])
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.username === '' || form.password === '') {
      setError("Username or Password required")
    } else {
      setError('')
      try {


        let data = await fetch(`/api/user/login`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form),


        });
        let msg = await data.json()
        console.log("msg", msg)
        let objKeys = Object.keys(msg)
        if (objKeys.includes("error")) {

          setError(msg.error)
          console.log("msg.error", msg.error)
        } else {
          navigate("/dashboard")
          setForm({username: '', password: '' })
        }
      } catch (error) {
        console.log("fetch error",error)
      }

    }
  }
  const handleHideShow = (e) => {
    setShowPassword(!showPassword)
  }
  return (
    <div className='bg-slate-300 h-[100vh] flex items-center justify-center flex-col'>
      <h1 className='text-center text-5xl font-bold mb-32'>Welcome Back</h1>

      <form >
        <div className="relative w-[51vw]">
          <input type="text" value={form.username} onChange={handleChange} name="username" id="" autoComplete='off' required className='w-full bg-slate-300 p-2 border-2 border-blue-700 focus:outline-none' />
          <label htmlFor="username" className='nameLabel text-gray-500 absolute top-3'>Username</label>

        </div>
        <div className="input-label relative mt-3 w-[51vw]">
          <input type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} name="password" id="" autoComplete='off' required className='w-full bg-slate-300 p-2 border-2 border-blue-700 focus:outline-none' />
          <label htmlFor="password" className='nameLabel text-gray-500 absolute top-3'>Password</label>
          {showPassword ? <span className='absolute top-[4px] right-1 cursor-pointer' onClick={handleHideShow}>
            <IoEyeOff size={35} color='#1338b4' />
          </span> : <span className='absolute top-[4px] right-1 cursor-pointer' onClick={handleHideShow}>
            <IoIosEye size={35} color='#1338b4' />
          </span>}
        </div>
        <div className="submit relative mt-3 w-[51vw]">
          <button onClick={handleSubmit} className='bg-gradient-to-r from-purple-500 to-red-500 active:bg-gradient-to-l w-full text-center p-3'>Login</button>
        </div>
      </form>
      {error && <div className='text-red-700 font-bold justify-self-start'>{error}</div>}
    </div>
  )
}

export default Login
