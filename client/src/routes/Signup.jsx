import { React, useState } from 'react'
import "../App.css"
import { IoEyeOff } from 'react-icons/io5'
import { IoIosEye } from "react-icons/io"
const api = import.meta.env.VITE_API_URL
const Signup = () => {
  let pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const [form, setForm] = useState({ name: "", username: "", email: "", address:"", colony:"", state:"", pincode:"", password: "" })
  const [error, setError] = useState({})
  const [confirmPassword, setConfirmPassword] = useState()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [responseError, setResponseError] = useState()

  const handleHideShow = (e) => {
    setShowPassword(!showPassword)
  }
  const handleConfirmHideShow = (e) => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleChange = (e) => {
    console.log(Object.values(error))

    setForm({ ...form, [e.target.name]: e.target.value })
    if (e.target.value.length === 0 && Object.values(error).length > 0) {
      setError({ ...error, [e.target.name]: `${e.target.name} is required` })
    }

    else if (e.target.value.length < 3 && Object.values(error).length > 0 && e.target.name !== "address" && e.target.name !== "colony"
              && e.target.name !== "state") {
      setError({ ...error, [e.target.name]: `${e.target.name}'s length must be greater than 2` })
    } else if (e.target.value.length > 2 && Object.values(error).length > 0) {
      setError({ ...error, [e.target.name]: "" })
    }

    if(e.target.name==="address" && e.target.value.length !==0 && Object.values(error).length > 0){
        setError({ ...error, [e.target.name]: "" })
      }
      
      if (e.target.name === "state" && e.target.value.length !==0 && Object.values(error).length > 0){
        setError({ ...error, [e.target.name]: "" })
      }

    if (e.target.name === "email" && Object.values(error).length > 0) {
      if(e.target.value.length===0){
        setError({ ...error, [e.target.name]: `${e.target.name} is required` })
      }
      else if (!pattern.test(e.target.value)) {
        setError({ ...error, [e.target.name]: "email should be in abc@yz.com" })
      } else {
        setError({ ...error, [e.target.name]: "" })
      }
    }

    if (e.target.name === "pincode" && Object.values(error).length > 0) {
      if(e.target.value.length==0){
        setError({ ...error, [e.target.name]: `${e.target.name} is required` })
      }
      else if (e.target.value.length!==6) {
        setError({ ...error, [e.target.name]: "please enter valid pincode" })
      } else {
        setError({ ...error, [e.target.name]: "" })
      }
    }
    if (e.target.name === "password" && Object.values(error).length > 0) {
      if(e.target.value.length===0){
        setError({ ...error, [e.target.name]: `${e.target.name} is required` })
      }
      else if (e.target.value.length < 8) {
        setError({ ...error, [e.target.name]: "passwords's length must be greater than 7" })

      } else {
        setError({ ...error, [e.target.name]: "" })
      }
    }


    

  }
  const handleConfirm = (e) => {

    setConfirmPassword(e.target.value)

    if (e.target.value !== form.password && Object.values(error).length > 0) {
      setError({ ...error, [e.target.name]: "Password and Confirm password must be same" })


    } else if (e.target.value === form.password && Object.values(error).length > 0) {
      setError({ ...error, [e.target.name]: "" })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let newError = { name: "", username: "" }

    if (form.name === "") {
      newError.name = "name is required"
      setError(newError)

    }
    else if (form.name.length < 3) {
      newError.name = "name's length must be greater than 2"
      setError(newError)

    } else {
      newError.name = ""
      setError(newError)
    }
    if (form.username === "") {
      newError.username = "username is required"
      setError(newError)

    }
    else if (form.username.length < 3) {
      newError.username = "username's length must be greater than 2"
      setError(newError)

    } else {
      newError.username = ""
      setError(newError)
    }
    if (form.email === "") {
      newError.email = "email is required"
      setError(newError)

    }
    else if (form.email.length < 3) {
      newError.username = "email's length must be greater than 2"
      setError(newError)

    } else {
      newError.email = ""
      setError(newError)
    }

    if (form.email === "") {
      newError.email = "email is required"
      setError(newError)

    }
    else if (form.email.length < 3) {
      newError.username = "email's length must be greater than 2"
      setError(newError)

    } else if (!pattern.test(form.email)) {
      newError.email = "email should be in abc@yz.com"
      setError(newError)
    } else {
      newError.email = ""
      setError(newError)
    }

    if(form.address===""){
      newError.address = "address is required"
      setError(newError)
    }
    else{
      newError.address = ""
      setError(newError)
    }
    if(form.state===""){
      newError.state = "state is required"
      setError(newError)
    }
    else{
      newError.state = ""
      setError(newError)
    }
    if(form.pincode===""){
      newError.pincode = "pincode is required"
      setError(newError)
    }
    else if(form.pincode.length !== 6){
      newError.pincode = "enter valid pincode"
      setError(newError)
    }
    else if(isNaN(form.pincode) ){
      newError.pincode = "picode must be number"
      setError(newError)
    }
    else{
      newError.pincode = ""
      setError(newError)
    }

    if (form.password === "") {
      newError.password = "password is required"
      setError(newError)

    }
    else if (form.password.length < 8) {
      newError.password = "passwords's length must be greater than 7"
      setError(newError)

    } else {
      newError.password = ""
      setError(newError)
    }
    if (!newError.password) {
      if (form.password !== confirmPassword) {
        newError.confirmpassword = "Password and Confirm password must be same"
        setError(newError)
      } else {
        newError.confirmpassword = ""
        setError(newError)
      }
    }
 

    if (newError.name === "" && newError.username === "" && newError.email === ""  && newError.address === "" 
      && newError.state === ""
      && newError.pincode === ""
      &&  newError.password === "" 
      && newError.confirmpassword === "") {
    let res = await fetch(`${api}/user/signup`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      let msg = await res.json()
      let objKeys = Object.keys(msg)
      console.log(msg)
      if (objKeys.includes("error")) {
        setResponseError(msg.error)
      } else {
        setResponseError("")
        setForm({ ...form, name: "", username: "", email: "", password: "", address:"",colony:"",state:"",pincode:"" })
        setConfirmPassword("")
        setError({})
      }
    }

  }

  return (
    <div className='bg-slate-300  flex items-center justify-center'>


      <form  className='my-10'>
        <div className="relative w-[51vw]">
          <input type="text" onChange={handleChange} value={form.name} name="name" id="" autoComplete='off' required className='w-full bg-slate-300 p-2 pl-0 border-b-2 border-blue-700 focus:outline-none' />
          <label htmlFor="username" className='signnameLabel text-gray-500 absolute top-3 left-0'>Name</label>
          {error.name && <div className='mt-1 text-red-700 font-bold'> {error.name} </div>}
        </div>


        <div className="input-label relative my-12 w-[51vw]">
          <input type="text" onChange={handleChange} value={form.username} name="username" id="" autoComplete='off' required className='w-full bg-slate-300 p-2 pl-0 border-b-2 border-blue-700 focus:outline-none' />
          <label htmlFor="username" className='signnameLabel text-gray-500 absolute left-0 top-3'>Username</label>
          {error.username && <div className='mt-1 text-red-700 font-bold'> {error.username} </div>}
        </div>

        <div className="input-label relative my-12 w-[51vw]">
          <input type="text" onChange={handleChange} value={form.email} name="email" id="" autoComplete='off' required className='w-full bg-slate-300 p-2 pl-0 border-b-2 border-blue-700 focus:outline-none' />
          <label htmlFor="username" className='signnameLabel text-gray-500 absolute left-0 top-3'>Email</label>
          {error.email && <div className='mt-1 text-red-700 font-bold'> {error.email} </div>}
        </div>
        <div className="input-label relative my-12 w-[51vw]">
          <input type="text" onChange={handleChange} value={form.address} name="address" id="" autoComplete='off' required className='w-full bg-slate-300 p-2 pl-0 border-b-2 border-blue-700 focus:outline-none' />
          <label htmlFor="username" className='signnameLabel text-gray-500 absolute left-0 top-3'>Shop/Office Address</label>
          {error.address && <div className='mt-1 text-red-700 font-bold'> {error.address} </div>}
        </div>
       
        <div className="input-label relative my-12 w-[51vw]">
          <input type="text" onChange={handleChange} value={form.state} name="state" id="" autoComplete='off' required className='w-full bg-slate-300 p-2 pl-0 border-b-2 border-blue-700 focus:outline-none' />
          <label htmlFor="username" className='signnameLabel text-gray-500 absolute left-0 top-3'>State</label>
          {error.state && <div className='mt-1 text-red-700 font-bold'> {error.state} </div>}
        </div>
        <div className="input-label relative my-12 w-[51vw]">
          <input type="text" onChange={handleChange} value={form.pincode} name="pincode" id="" autoComplete='off' required className='w-full bg-slate-300 p-2 pl-0 border-b-2 border-blue-700 focus:outline-none' />
          <label htmlFor="username" className='signnameLabel text-gray-500 absolute left-0 top-3'>Pincode</label>
          {error.pincode && <div className='mt-1 text-red-700 font-bold'> {error.pincode} </div>}
        </div>

        <div className="input-label relative my-12 w-[51vw]">
          <input type={showPassword ? "text" : "password"} onChange={handleChange} value={form.password} name="password" id="" autoComplete='off' required className='w-full bg-slate-300 p-2 pl-0 border-b-2 border-blue-700 focus:outline-none' />
          <label htmlFor="password" className='signnameLabel text-gray-500 absolute left-0 top-3'>Password</label>
          {showPassword ? <span className='absolute top-[4px] right-1 cursor-pointer' onClick={handleHideShow}>
            <IoEyeOff size={35} color='#1338b4' />
          </span> : <span className='absolute top-[4px] right-1 cursor-pointer' onClick={handleHideShow}>
            <IoIosEye size={35} color='#1338b4' />
          </span>}
          {error.password && <div className='mt-1 text-red-700 font-bold'> {error.password} </div>}
        </div>

        <div className="input-label relative my-12 w-[51vw]">
          <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} name="confirmpassword" id="" autoComplete='off' onChange={handleConfirm} required className='w-full bg-slate-300 p-2 pl-0 border-b-2 border-blue-700 focus:outline-none' />
          <label htmlFor="confirmpassword" className='signnameLabel text-gray-500 absolute left-0 top-3'>Confirm password</label>
          {showConfirmPassword ? <span className='absolute top-[4px] right-1 cursor-pointer' onClick={handleConfirmHideShow}>
            <IoEyeOff size={35} color='#1338b4' />
          </span> : <span className='absolute top-[4px] right-1 cursor-pointer' onClick={handleConfirmHideShow}>
            <IoIosEye size={35} color='#1338b4' />
          </span>}
          {error.confirmpassword && <div className='mt-1 text-red-700 font-bold'> {error.confirmpassword} </div>}
        </div>

        <div className="submit relative mt-3 w-[51vw]">
          <button type='submit' onClick={handleSubmit} className='bg-gradient-to-r from-purple-500 to-red-500 active:bg-gradient-to-l w-full text-center p-3'>Sign up</button>
        </div>

        {responseError && <div className="text-red-700 font-bold text-xl"> {responseError} </div>}



      </form>
    </div>
  )
}

export default Signup
