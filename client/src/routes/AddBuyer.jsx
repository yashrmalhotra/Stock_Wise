import React, { useEffect, useRef, useState } from 'react'
import getUser from '../getUser'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { buyerSaveAndEdit } from '../saveAndEdit'


const AddBuyer = () => {
    const ref = useRef({})
    const navigate = useNavigate()
    const [form, setForm] = useState({ buyer_name: "", address: "", state: "", pincode: "" })
    const [buyerError, setBuyerError] = useState()
    const [addressError, setAddressError] = useState()
    const [stateError, setStateError] = useState()
    const [pincodeError, setPincodeError] = useState()
    const [edit,setEdit] = useState(false)
    const [searchParams,getSearchParams] = useSearchParams()
    useEffect(() => {
        getUser(navigate)
        let edit = searchParams.get("edit")==="true"
        let buyerDetails = JSON.parse(searchParams.get("form"))
        let stringPincode = (buyerDetails?.pincode)?.toString()

        if(edit && buyerDetails){
            setEdit(edit)
            setForm({ buyer_name: buyerDetails.name,uid:buyerDetails.uid, address: buyerDetails?.address ? buyerDetails?.address :"", state: buyerDetails?.state ? buyerDetails?.state:"", pincode:stringPincode ? stringPincode :""})
        }
      
    },[])
    const handleChange = (e) => {

        setForm({ ...form, [e.target.name]: e.target.value })
        if(buyerError==="" || buyerError==="Buyer's name is required"){
        if (e.target.name === "buyer_name") {
            if (e.target.value === "") {
                setBuyerError( "Buyer's name is required")
                console.log(buyerError)
            }
            else {
                setBuyerError("")
            }
        }

        if (ref.current.address.value !== "" ) {
            if (ref.current.state.value === "" && ref.current.pincode.value === "") {
                setStateError("State is required")
                setPincodeError("Pincode is required")
            }
            else if (ref.current.state.value === "" && (ref.current.pincode.value === "" || ref.current.pincode.value !== "")) {
                setStateError("State is required")
            }
            else if (ref.current.state.value !== "" && (ref.current.pincode.value === "" || ref.current.pincode.value !== "")) {
                setStateError("")
            }
            if (ref.current.pincode.value === "" && (ref.current.state.value === "" || ref.current.state.value !== "")) {
                setPincodeError("Pincode is required")
            }
            else if (ref.current.pincode.value !== "" && (ref.current.state.value === "" || ref.current.state.value !== "")) {

                if (e.target.name === "pincode" && e.target.value !== "") {


                    if (isNaN(e.target.value) || e.target.value.length !== 6) {
                        setPincodeError("Please enter valid pincode")
                    } else {
                        setPincodeError("")
                    }

                }
            }
        }
        if (ref.current.state.value !== "") {
            if (ref.current.address.value === "" && ref.current.pincode.value === "") {
                setAddressError("Address is required")
                setPincodeError("Pincode is required")
            }
            else if (ref.current.address.value === "" && (ref.current.pincode.value === "" || ref.current.pincode.value !== "")) {
                setAddressError("Address is required")
            }
            else if (ref.current.state.value !== "" && (ref.current.pincode.value === "" || ref.current.pincode.value !== "")) {
                setAddressError("")
            }
            if (ref.current.pincode.value === "" && (ref.current.state.value === "" || ref.current.state.value !== "")) {
                setPincodeError("Pincode is required")
            }
            else if (ref.current.pincode.value !== "" && (ref.current.state.value === "" || ref.current.state.value !== "")) {

                if (e.target.name === "pincode" && e.target.value !== "") {


                    if (isNaN(e.target.value) || e.target.value.length !== 6) {
                        setPincodeError("Please enter valid pincode")
                    } else {
                        setPincodeError("")
                    }

                }
            }
        }
        if (ref.current.pincode.value !== "") {
            if (ref.current.address.value === "" && ref.current.state.value === "") {
                setAddressError("Address is required")
                setStateError("State is required")
            }
            else if (ref.current.address.value === "" && (ref.current.state.value === "" || ref.current.state.value !== "")) {
                setAddressError("Address is required")
            }
            else if (ref.current.address.value !== "" && (ref.current.state.value === "" || ref.current.state.value !== "")) {
                setAddressError("")
            }
            if (ref.current.state.value === "" && (ref.current.address.value === "" || ref.current.address.value !== "")) {
                setStateError("State is required")
            }
            else if (ref.current.state.value !== "" && (ref.current.address.value === "" || ref.current.address.value !== "")) {
                setStateError("")
            }
        }
        if (ref.current.address.value === "" && ref.current.state.value === "" && ref.current.pincode.value === "") {
            setAddressError("")
            setStateError("")
            setPincodeError("")
        }



        if (e.target.name === "pincode" && e.target.value !== "") {


            if (isNaN(e.target.value) || e.target.value.length !== 6) {
                setPincodeError("Please enter valid pincode")
            } else {
                setPincodeError("")
            }

        }
}



    }
    const handleSave = () => {
        buyerSaveAndEdit(form, setBuyerError, setAddressError, setStateError, setPincodeError, edit?"PUT":"POST",navigate,edit ? "edit":"save")
    }
    return (
        <div>
            <Navbar />
            <div className='container mx-auto my-3'>
                <form >
                    <div className="">
                        <input ref={(e) => { ref.current.name = e }} type="text" onChange={handleChange} value={form.buyer_name} name="buyer_name" id="" placeholder="Enter buyer's name" autoComplete='off' required className='w-full  p-2    border-2 border-blue-700 focus:outline-none' />
                        {buyerError && <div className='font-bold text-red-700'>{buyerError}</div>}
                    </div>
                    <div className="my-5">
                        <input ref={(e) => { ref.current.address = e }} type="text" onChange={handleChange} value={form.address} name="address" id="" placeholder="Enter buyer's address" autoComplete='off' required className='w-full  p-2    border-2 border-blue-700 focus:outline-none' />
                        {addressError && <div className='font-bold text-red-700'>{addressError}</div>}
                    </div>

                    <div className="my-5">
                        <input ref={(e) => { ref.current.state = e }} type="text" onChange={handleChange} value={form.state} name="state" id="" placeholder="Enter buyer's state" autoComplete='off' required className='w-full  p-2    border-2 border-blue-700 focus:outline-none' />
                        {stateError && <div className='font-bold text-red-700'>{stateError}</div>}
                    </div>
                    <div className="my-5">
                        <input ref={(e) => { ref.current.pincode = e }} type="text" onChange={handleChange} value={form.pincode} name="pincode" id="" placeholder="Enter buyer's pincode" autoComplete='off' required className='w-full  p-2    border-2 border-blue-700 focus:outline-none' />
                        {pincodeError && <div className='font-bold text-red-700'>{pincodeError}</div>}
                    </div>
                </form>
                <div className="submit">
                    <button onClick={handleSave} className='bg-gradient-to-r from-purple-500 to-red-500 active:bg-gradient-to-l w-full text-center p-3'>Save</button>
                </div>
            </div>
        </div>
    )
}

export default AddBuyer
