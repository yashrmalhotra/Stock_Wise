import React, { useCallback, useEffect, useState, useContext, createContext } from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'
import { billSaveAndEdit } from '../saveAndEdit'
import { RxCrossCircled } from 'react-icons/rx'
import getUser from '../getUser'
import { LiaEdit } from "react-icons/lia";
import { AiFillDelete } from "react-icons/ai";


const Billing = () => {
  const api = import.meta.env.VITE_API_URL
  const [bill, setBill] = useState([])
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState({})
  const [product, setProduct] = useState([])
  const [buyerDetails, setBuyerDetails] = useState({ name: "", uid: "", address: "", state: "", pincode: "" })
  const [buyers, setBuyers] = useState([])
  const [form, setForm] = useState({ buyer_uid: "Select Buyer", sku: "Select SKU", product_name: "", product_price: "", qty: "" })
  const [edit, setEdit] = useState(false)
  const navigate = useNavigate()
  const [total, setTotal] = useState({ price: 0, qty: 0, bill: 0 })
  const [defaultPrice, setDefaultprice] = useState(0)
  const [stock, setStock] = useState(0)
  const getProducts = async () => {
    let response = await fetch(`/api/product`, { credentials: "include" })
    let product = await response.json()
    let resArray = product.product
    setProduct(resArray)

  }
  const getBuyers = async () => {
    const res = await fetch(`/api/buyer`, { credentials: "include" })
    const buyers = await res.json()
    setBuyers(buyers)
  }
  useEffect(() => {
    getUser(navigate)
    getProducts()
    getBuyers()
  }, [])

  const handleChange = (e) => {

    setForm({ ...form, [e.target.name]: e.target.value })
    console.log(error)
    if (e.target.name === "buyer_uid" && e.target.value === "Add Buyer") {

      navigate("/billing/addbuyer")
    }

    else if (e.target.name === "buyer_uid" && e.target.value === "Select Buyer" && Object.values(error).length > 0) {
      setError({ ...error, [e.target.name]: "Buyer's name is required" })
    }
    else if ((e.target.name === "buyer_uid" && e.target.value !== "Select Buyer" && Object.values(error).length > 0)) {
      setError({ ...error, [e.target.name]: "" })

    }
    if (e.target.name === "sku" ) {
      if (e.target.value !== "Select SKU") {


        let filterProductDetails = product.filter(item => item.sku === e.target.value)[0]

        setForm({ ...form, product_name: filterProductDetails.product_name, sku: e.target.value })
        setDefaultprice(filterProductDetails.product_price)
        setStock(filterProductDetails.stock)
      
      }

      if (e.target.value === "Select SKU" && Object.values(error).length > 0) {
        setForm({ ...form, product_name: "", sku: e.target.value })
        setError({ ...error, [e.target.name]: "Select SKU" })

      }else if (e.target.value !== "Select SKU" && Object.values(error).length > 0){
        setError({ ...error, [e.target.name]: "" })
      }
    }


    if (e.target.name === "product_price" && Object.values(error).length > 0) {
      if (e.target.value === "") {
        setError({ ...error, [e.target.name]: "Product's price is required" })

      } else if (isNaN(e.target.value)) {
        setError({ ...error, [e.target.name]: "Product's price must be a number" })
      }
      else {
        setError({ ...error, [e.target.name]: "" })
      }
    }
    if (e.target.name === "qty") {
      if (e.target.value === "") {
        setError({ ...error, [e.target.name]: "Product's quantity is required" })

      }
      else if (isNaN(e.target.value)) {
        setError({ ...error, [e.target.name]: "Product's quantity must be number" })
      }
      else {
        let qty = Number(e.target.value)
        if (qty > stock) {
          setError({ ...error, [e.target.name]: "Not enough stock" })
        } else {
          setError({ ...error, [e.target.name]: "" })
        }
      }
    }




  }
  useEffect(() => {

    let price = bill.reduce((a, item) => a + Number(item.product_price), 0)
    let qty = bill.reduce((a, item) => a + Number(item.qty), 0)
    let pxq = bill.map((item) => Number(item.qty * item.product_price))
    let bill2 = pxq.reduce(((a, item) => a + item), 0)
    setTotal({ price, qty, bill: bill2 })
    addBuyer()
  }, [bill])

  const handleVisiblity = () => {
    setVisible(true)
  }
  const handleEditShow = (sku) => {

    setEdit(true)
    let data = bill.filter(item => item.sku === sku)[0]
    setForm(data)
    let newData = bill.filter(item => item.sku !== sku)
    let filterProductDetails = product.filter(item => item.sku === sku)[0]
    setDefaultprice(filterProductDetails.product_price)
    setBill(newData)
    console.error(error)
    setVisible(true)

  }
  const addBuyer = () => {
    let buyer = buyers.filter(item => item.uid === form.buyer_uid)[0]
    setBuyerDetails({ name: buyer?.buyer_name, uid: buyer?.uid, address: buyer?.address, state: buyer?.state, pincode: buyer?.pincode })

  }
  const handleDelete = (sku) => {
    let newData = bill.filter(item => item.sku !== sku)
    setBill(newData)
  }
  const handleSave = () => {
    billSaveAndEdit(form, setForm, setError, setVisible, bill, setBill, setDefaultprice, stock)
  }

  const handleEdit = () => {
    billSaveAndEdit(form, setForm, setError, setVisible, bill, setBill, setDefaultprice, stock, setEdit)
  }

  const generateInvoice = async () => {
    console.log(buyerDetails)
    let res = await fetch(`api/buyer/generate-invoice`, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ bill, buyerDetails, total }) })
    let blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "invoice.pdf")
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    console.log("url ", url)

  }

  const handleBuyerEdit = ()=>{
    const params = new URLSearchParams({edit:true,form:JSON.stringify(buyerDetails)})
    navigate(`/billing/addBuyer?${params.toString()}`)
  }
  let sno = 0

  return (
    <>
      <Navbar />
      <div className="w-full py-1 flex justify-end bg-blue-500 px-2">
        <button onClick={handleVisiblity} className='bg-gradient-to-r from-purple-500 to-red-500 active:bg-gradient-to-l px-1 text-white font-bold w-14'>Add</button>
      </div>

      {bill.length > 0 ?

        <div >
          {buyerDetails && <div className="bg-blue-200 my-1 p-1 ml-1 w-1/2 flex justify-between items-center">
            <div>
              <div className='font-bold'>Buyer Details</div>
              <div>Name<span className='font-bold'>:</span> {buyerDetails.name}</div>
              <div>UID<span className='font-bold'>:</span> {buyerDetails.uid}</div>
              {buyerDetails.address &&
                <div>
                  <div>Address<span className='font-bold'>:</span> {buyerDetails.address}</div>
                  <div>State<span className='font-bold'>:</span> {buyerDetails.state}</div>
                  <div>Pincode<span className='font-bold'>:</span> {buyerDetails.pincode}</div>
                </div>
              
            }
            </div>
            <div><button className='bg-blue-500 active:bg-blue-700' onClick={handleBuyerEdit}> <LiaEdit size={25}/> </button></div>
          </div>}
          <div className='bg-gray-200 grid grid-cols-[3vw_47vw_10vw_10vw_10vw_20vw] gap-x-[2px] my-[2px] text-white text-center'>
            <div className='bg-blue-700 '>S.no.</div>
            <div className='bg-blue-700 '>Info</div>
            <div className='bg-blue-700 '>Price (In Rs)</div>
            <div className='bg-blue-700 '>Quantity</div>
            <div className='bg-blue-700 '>Total</div>
            <div className='bg-blue-700 '>Actions</div>
          </div>

          {
            bill.map((item, i) => {
              sno = i + 1
              return <div className='grid grid-cols-[3vw_47vw_10vw_10vw_10vw_20vw] bg-gray-200 gap-x-[2px] my-[2px]'>
                <div className='bg-white text-center'>{i + 1}</div>
                <div className='px-3 bg-white'>
                  <div>{item.product_name}</div>
                  <div className='text-xs text-slate-400'>{item.sku}</div>
                </div>
                <div className='text-center bg-white flex justify-center items-center'>{((Number(item.product_price))).toLocaleString("en-IN")}</div>
                <div className='text-center bg-white flex justify-center items-center'>{((Number(item.qty))).toLocaleString("en-IN")}</div>
                <div className='text-center bg-white flex justify-center items-center'>{((Number(item.product_price * item.qty))).toLocaleString("en-IN")}</div>
                <div className='bg-white flex justify-center items-center gap-3'>
                  <button className='bg-blue-500 active:bg-blue-700 flex' onClick={() => (handleEditShow(item.sku))}><LiaEdit size={30} /></button>
                  <button className='bg-blue-500 active:bg-blue-700 flex' onClick={() => { handleDelete(item.sku) }}> <AiFillDelete size={30} /> </button>
                </div>
              </div>
            })
          }


          <div className="bg-gray-200 text-white text-xl p-1 grid grid-cols-[3vw_47vw_10vw_10vw_10vw_20vw] gap-x-[2px] mx-0 px-0">

            <div className='bg-blue-500 text-white text-center'>{sno + 1}</div>
            <div className='bg-blue-500 text-white text-left px-3'>TOTAL</div>
            <div className='bg-blue-500 text-white text-center'>{total.price.toLocaleString("en-IN")}</div>
            <div className='bg-blue-500 text-white text-center'>{total.qty.toLocaleString("en-IN")}</div>
            <div className='bg-blue-500 text-white text-center'>{total.bill.toLocaleString("en-IN")}</div>
            <div className='bg-blue-500 text-white text-center'></div>
          </div>
          <div className="container mx-auto">
            <button onClick={generateInvoice} className='praac bg-gradient-to-r from-purple-500 to-red-500 active:bg-gradient-to-l w-full  h-10 text-center text-xl font-bold text-white'>Generate Invoice</button>
          </div>
        </div>


        : <div className='bg-gray-300 p-1'>No bills yet</div>

      }
      <div>
        <div className={`z-10 h-[90vh] bg-black bg-opacity-40 w-[92vw] fixed top-[45px] flex justify-center items-center shadow-2xl left-[4vw] ${visible ? `block` : `hidden`}`}>
          <button className='absolute top-1 right-1 ' onClick={() => { setVisible(false), setEdit(false) }}><RxCrossCircled size={45} color='white' strokeWidth={1} /></button>

          <div className='bg-white p-3 w-[80%] h-[90%] container flex flex-col items-center'>

            <form>
              <div className='w-[950px] my-3 py-3'>
                <select onChange={handleChange} name="buyer_uid" disabled={buyerDetails.name} value={form.buyer_uid} className='w-full border-2 p-2 outline-none border-blue-700' id="" >
                  <option value="Select Buyer">Select Buyer</option>
                  <option value="Add Buyer">Add Buyer</option>
                  {
                    buyers.map((item) => {
                      return <option key={item._id} className='' value={item.uid}>
                        {`${item.buyer_name} UID: ${item.uid}`}
                      </option>
                    })
                  }
                </select>
                {error.buyer_uid && <div className='text-red-700 font-bold'> {error.buyer_uid} </div>}
              </div>
              <div className='w-[950px] my-3'>
                <select onChange={handleChange} name="sku" value={form.sku} id="" className='w-full mx-auto border-2 p-2 focus:outline-none border-blue-700 '>
                  <option value="Select SKU">Select SKU</option>

                  {
                    product.map((item) => {
                      return <option key={item._id} disabled={bill.some(item2 => item2.sku === item.sku)} value={item.sku}>{item.sku}</option>
                    })
                  }
                </select>
                {error.sku && <div className='text-red-700 font-bold'> {error.sku} </div>}
              </div>
              <div className='w-[950px] my-3'>
                <input type="text" onChange={handleChange} name="product_price" value={form.product_price} placeholder='Enter Product Price' required className='w-full mx-auto border-2 p-2 focus:outline-none border-blue-700 ' />
                <div className="p-1 mt-1 w-fit bg-gray-400"> Default Price {defaultPrice} </div>
                {error.product_price && <div className='text-red-700 font-bold'> {error.product_price} </div>}

              </div>
              {
                form.product_name && (
                  <div className={`w-[950px] my-3 ${form.product_name === "Select SKU" ? "hidden" : "block"}`}>
                    <div className='w-full mx-auto border-2 p-2 focus:outline-none border-blue-700 '>{form.product_name}</div>
                  </div>
                )
              }
              <div className='w-[950px] my-3'>
                <input type="text" onChange={handleChange} name="qty" value={form.qty} placeholder='Enter Quantity' required className='w-full mx-auto border-2 p-2 focus:outline-none border-blue-700 ' />
                <div className="p-1 mt-1 w-fit bg-gray-400"> Stock {stock} </div>
                {error.qty && <div className='text-red-700 font-bold'> {error.qty} </div>}
              </div>
            </form>
            {<button onClick={edit ? handleEdit : handleSave} className='mb-3 bg-gradient-to-r from-purple-500 to-red-500 active:bg-gradient-to-l w-24 h-10 text-center text-xl font-bold text-white'>{edit ? "Edit" : "Save"}</button>}
          </div>

        </div>
      </div>

    </>
  )
}

export default Billing
