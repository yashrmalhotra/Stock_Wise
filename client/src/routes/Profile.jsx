import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'
import getUser from '../getUser'
import { LiaEdit } from 'react-icons/lia'

const api = import.meta.env.VITE_API_URL
const Profile = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState({})
    const [form, setForm] = useState({ name: "", email: "", address: "", state: "", pincode: "" })
    const [edit, setEdit] = useState(false)
    const [error, setError] = useState({})


    let pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const getDetails = async () => {
        const res = await fetch(`${api}/user/profile`, { credentials: "include" })
        const details = await res.json()
        setForm({ name: details.name,email:details.email,address: details.address, state: details.state, pincode: details.pincode })
        console.log(details, "details")
        setUser({username:details.username,sales:details.sales,unitSold:details.unitSold})
    }

    useEffect(() => {
        getUser(navigate)
        getDetails()

    },[])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        if (e.target.name === "name") {
            if (e.target.value === "") {
                setError({ ...error, name: "Name is required" })
            }
            else if (e.target.value.length < 3) {
                setError({ ...error, name: "Name's length must be 3 characters" })
            } else {
                let newError = { ...error }
                delete newError["name"]
                setError(newError)
            }
        }

        if (e.target.name === "email") {
            if (e.target.value === "") {
                setError({ ...error, email: "Email is required" })
            }
            else if (!pattern.test(e.target.value)) {
                setError({ ...error, email: "email should be in abc@yz.com" })
            } else {
                let newError = { ...error }
                delete newError["email"]
                setError(newError)
            }
        }

        if (e.target.name === "address") {
            if (e.target.value === "") {
                setError({ ...error, address: "Address is required" })
            }
            else {
                let newError = { ...error }
                delete newError["address"]
                setError(newError)
            }
        }
        if (e.target.name === "state") {
            if (e.target.value === "") {
                setError({ ...error, state: "State is required" })
            }
            else {
                let newError = { ...error }
                delete newError["state"]
                setError(newError)
            }
        }
        if (e.target.name === "pincode") {
            if (e.target.value === "") {
                setError({ ...error, pincode: "Pincode is required" })
            }
            else if (isNaN(e.target.value) || e.target.value.length !== 6) {
                setError({ ...error, pincode: "Please enter valid pincode" })
            }
            else {
                let newError = { ...error }
                delete newError["pincode"]
                setError(newError)
            }
        }
    }
    const handleEdit = async () => {
        await fetch(`${api}/user`,{method:"PUT",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify(form)})
        setEdit(false)
       
    }

    return (
        <>
            <Navbar />
            <div className='w-full  p-5'>
                <div className=" border-[1px] border-black flex h-[70px]">
                    <div className=' bg-blue-200 w-[10vw] flex items-center px-2'>Name</div>
                    <div className='min-h-11 w-[1px] bg-black'></div>
                    <div className="w-[80vw] bg-white flex flex-col justify-center px-2 font-bold">
                        <input type="text" onChange={handleChange} value={form.name} name="name" disabled={!edit} className={`bg-transparent px-2 w-full focus:outline-none ${edit ? "border border-black" : "border-bone"} `} />
                        {error?.name && <div className='text-red-700 font-bold'>{error.name}</div>}
                    </div>
                </div>


                <div className=" border-[1px] border-black flex h-[70px]">
                    <div className=' bg-blue-200 w-[10vw] flex items-center px-2'>Userame</div>
                    <div className='min-h-11 w-[1px] bg-black'></div>
                    <div className="w-[80vw] bg-white flex items-center px-4 font-bold">{user.username}</div>
                </div>
                <div className=" border-[1px] border-black flex h-[70px]">
                    <div className=' bg-blue-200 w-[10vw] flex items-center px-2'>Sales</div>
                    <div className='min-h-11 w-[1px] bg-black'></div>
                    <div className="w-[80vw] bg-white flex items-center px-4 font-bold">{Number(user.sales).toLocaleString("en-IN")}</div>
                </div>
                <div className=" border-[1px] border-black flex h-[70px]">
                    <div className=' bg-blue-200 w-[10vw] flex items-center px-2'>Unit sold</div>
                    <div className='min-h-11 w-[1px] bg-black'></div>
                    <div className="w-[80vw] bg-white flex items-center px-4 font-bold">{Number(user.unitSold).toLocaleString("en-IN")}</div>
                </div>

                <div className=" border-[1px] border-black flex h-[70px]">
                    <div className=' bg-blue-200 w-[10vw] flex items-center px-2'>Email</div>
                    <div className='min-h-11 w-[1px] bg-black'></div>
                    <div className="w-[80vw] bg-white flex flex-col justify-center px-2 font-bold">
                        <input type="text" onChange={handleChange} value={form.email} name="email" disabled={!edit} className={`bg-transparent px-2 w-full focus:outline-none ${edit ? "border border-black" : "border-bone"} `} />
                        {error?.email && <div className='text-red-700 font-bold'>{error.email}</div>}
                    </div>
                </div>

                <div className=" border-[1px] border-black flex h-[70px]">
                    <div className=' bg-blue-200 w-[10vw] flex items-center px-2'>Address</div>
                    <div className='min-h-11 w-[1px] bg-black'></div>
                    <div className="w-[80vw] bg-white flex flex-col justify-center px-2 font-bold">
                        <input type="text" onChange={handleChange} value={form.address} name="address" disabled={!edit} className={`bg-transparent px-2 w-full focus:outline-none ${edit ? "border border-black" : "border-bone"} `} />
                        {error?.address && <div className='text-red-700 font-bold'>{error.address}</div>}
                    </div>
                </div>

                <div className=" border-[1px] border-black flex h-[70px]">
                    <div className=' bg-blue-200 w-[10vw] flex items-center px-2'>State</div>
                    <div className='min-h-11 w-[1px] bg-black'></div>
                    <div className="w-[80vw] bg-white flex flex-col justify-center px-2 font-bold">
                        <input type="text" onChange={handleChange} value={form.state} name="state" disabled={!edit} className={`bg-transparent px-2 w-full focus:outline-none ${edit ? "border border-black" : "border-bone"} `} />
                        {error?.state && <div className='text-red-700 font-bold'>{error.state}</div>}
                    </div>
                </div>
                <div className=" border-[1px] border-black flex h-[70px]">
                    <div className=' bg-blue-200 w-[10vw] flex items-center px-2'>Pincode</div>
                    <div className='min-h-11 w-[1px] bg-black'></div>
                    <div className="w-[80vw] bg-white flex flex-col justify-center px-2 font-bold">
                        <input type="text" onChange={handleChange} value={form.pincode} name="pincode" disabled={!edit} className={`bg-transparent px-2 w-full focus:outline-none ${edit ? "border border-black" : "border-bone"} `} />
                        {error?.pincode && <div className='text-red-700 font-bold'>{error.pincode}</div>}
                    </div>
                </div>

                <button className='bg-blue-500 active:bg-blue-700 flex w-full justify-center px-2 items-center text-white my-2 text-xl disabled:bg-gray-500' disabled={Object.keys(error).length > 0} onClick={edit ? handleEdit : () => setEdit(true)}>{`${edit ? "Save" : "Edit"}`}</button>

            </div>
        </>
    )
}

export default Profile
