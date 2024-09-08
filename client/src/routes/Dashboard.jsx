import { React, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { LiaEdit } from "react-icons/lia";
import { AiFillDelete } from "react-icons/ai";
import { RxCrossCircled } from "react-icons/rx";
import { PiArrowsDownUpBold } from "react-icons/pi";;
import { IoIosWarning } from "react-icons/io";
import { FaGreaterThan } from "react-icons/fa";
import { FaLessThan } from "react-icons/fa";
import Navbar from '../components/Navbar';
import { productSaveAndEdit } from "../saveAndEdit"
import getUser from '../getUser';

const Dshboard = () => {
  const [visible, setVisible] = useState(false)
  const [product, setProduct] = useState([])
  const [form, setForm] = useState({ product_name: "", product_price: "", stock: "", product_description: "", file: null, seleted: false })
  const [error, setError] = useState({})
  const [edit, setEdit] = useState(false)
  const [filterMenu, setFilterMenu] = useState(false)
  const [sortMenu, setSortMenu] = useState(false)
  const [deactiveFilter, setDectiveFilter] = useState(false)
  const [originalArray, setOriginalArray] = useState([])
  const fileRef = useRef()
  const sortRef = useRef()
  const filterRef = useRef()
  const sortBtnRef = useRef()
  const filterBtnRef = useRef()
  const [page, setPage] = useState(0)
  const [rows, setRows] = useState(5)
  const [totalPages, setTotalPages] = useState(0)
  const params = new URLSearchParams({ page: page, rows: rows })
  const startIndex = page * rows
  const endIndex = startIndex + rows
  const totalPage = Math.ceil(product.length / rows)

  const navigate = useNavigate();

  const getProducts = async () => {
    let response = await fetch(`/api/product?${params.toString()}`, { credentials: "include" })
    let product = await response.json()
    let resArray = product.product
    console.log(product, "product")
    let productArray = resArray.map((item) => {
      return {
        ...item,
        selected: false
      }
    })// adding selected key before set product array to handle check boxes


    setProduct(productArray)

    setOriginalArray(productArray)




  }
  useEffect(() => {


    getUser(navigate)
    getProducts()

  }, [])

  const prductPerPage = useMemo(() => {
    const products = product.slice(startIndex, endIndex)
    let calc = Math.ceil(product.length / rows)
    setTotalPages(calc)

    return products
  }, [page, rows, totalPage, product, originalArray])
  const handleVisiblity = () => {
    console.log(Object.values(error).length)
    setVisible(true)
  }
  const openFileBox = (e) => {

    fileRef.current.click()

  }

  const handleChange = (e) => {

    setForm({ ...form, [e.target.name]: e.target.value })


    if (e.target.name === "product_name" && e.target.value.length === 0 && Object.values(error).length > 0) {

      setError({ ...error, [e.target.name]: "Product's name is required" })
    }
    else if ((e.target.name === "product_name" && e.target.value.length < 3 && Object.values(error).length > 0)) {

      setError({ ...error, [e.target.name]: "Product's name length must be greater than 2" })
    }
    else if ((e.target.name === "product_name" && e.target.value.length > 2 && Object.values(error).length > 0)) {

      setError({ ...error, [e.target.name]: "" })
    }
    if (e.target.name === "product_price" && Object.values(error).length > 0) {
      if (e.target.value.length === 0) {
        setError({ ...error, [e.target.name]: "Product's price is required" })

      } else if (isNaN(e.target.value)) {
        setError({ ...error, [e.target.name]: "Product's price must be a number" })
      }
      else {
        setError({ ...error, [e.target.name]: "" })
      }
    }
    if (e.target.name === "stock" && Object.values(error).length > 0) {
      console.log(error)
      if (isNaN(e.target.value)) {
        setError({ ...error, [e.target.name]: "Stock must be a number" })
      }
      else {
        setError({ ...error, [e.target.name]: "" })
      }
    }

    if (e.target.name === "rowsPerPage") {
      setRows(e.target.value)
      setPage(0)
    }

  }
  const handleFileChange = (e) => {

    const file = e.target.files[0]

    setForm({ ...form, file: file })

  }
  const handleSave = () => {
    productSaveAndEdit(form, setError, setVisible, "add-product", "POST")
  }

  const handleSelectAll = (e) => {
    let newArray = [...product]
    newArray.forEach(item => (
      item.selected = e.target.checked
    ))

    setProduct(newArray)

  }
  const handleSelect = (e, id) => {
    let newArray = [...product]

    let index = newArray.findIndex((item) => {
      return id === item._id
    })
    newArray[index].selected = e.target.checked


    setProduct(newArray)


  }
  //delete 
  const handleDelete = async (id) => {


    let item = product.filter((item) => item._id === id)[0]
    let fileAndid = {
      id: item._id,
      file: item.file
    }
    let c = confirm(`Are you sure you want to delete product`)
    if (c) {
      await fetch(`api/product/delete`, { method: "DELETE", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(fileAndid) })
      setProduct(product.filter((item) => item._id !== id))
    }
  }
  const handleEditShow = (id) => {
    let data = product.filter((item) => id === item._id)[0]
    setForm({ id: data._id, product_name: data.product_name, product_price: data.product_price, stock: data.stock, product_description: data.product_description, oldFile: data.file })
    setVisible(true)

    setEdit(true)
    setError({})
  }
  const handleEdit = async () => {
    productSaveAndEdit(form, setError, setVisible, "edit", "PUT")

  }
  const handleActions = async (action) => {
    switch (action) {
      case "outofstock":
        let newArray = [...product]
        let updatedArray = []
        for (const i in newArray) {
          if (newArray[i].selected && newArray[i].stock > 0) {
            newArray[i].stock = 0
          }
          newArray[i].selected = false
          updatedArray.push(newArray[i]._id)
        }
        let productList = { list: updatedArray }
        let a = await fetch(`api/product/updateSelected`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(productList) })
        setProduct(newArray)
        break
      case "delete":
        let c = confirm("Are you sure you want to delete product")
        if (c) {
          let newArray = [...product]
          newArray = newArray.filter((item) => item.selected === true)
          console.log(newArray)
          setProduct(product.filter((item => item.selected === false)))
          await fetch(`api/product/deleteSelected`, { method: "DELETE", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(newArray) })
        }
        break
      case "lotohiprice":
        setProduct([...product].sort((a, b) => a.product_price - b.product_price))
        break
      case "hitoloprice":
        setProduct([...product].sort((a, b) => b.product_price - a.product_price))
        break
      case "lotohistock":
        setProduct([...product].sort((a, b) => a.stock - b.stock))
        break
      case "hitolostock":
        setProduct([...product].sort((a, b) => b.stock - a.stock))
        break
      case "stocklt10":

        setProduct(product.filter(item => item.stock < 10))
        setDectiveFilter(true)
        break
      case "stockgteq10&lt50":

        setProduct(product.filter(item => item.stock >= 10 && item.stock < 50))
        setDectiveFilter(true)
        break
      case "stockgteq50&lt100":

        setProduct(product.filter(item => item.stock >= 50 && item.stock < 100))
        setDectiveFilter(true)
        break

      default:
        setProduct(originalArray)
        setDectiveFilter(false)


    }
  }
  window.addEventListener("click", (e) => {


    if (e.target !== sortRef.current && e.target !== sortBtnRef.current && !sortBtnRef.current.contains(e.target)) {
      setSortMenu(false)

    }
    if (e.target !== filterRef.current && e.target !== filterBtnRef.current && !filterBtnRef.current.contains(e.target)) {
      setFilterMenu(false)
    }

  })




  return (
    <>

      <Navbar />
      <div className='w-screen  bg-blue-500 py-1 flex justify-between px-2'>
        <div className='flex gap-2'>
          <button onClick={() => { handleActions("outofstock") }} className='bg-gradient-to-r from-purple-500 to to-red-500 active:bg-gradient-to-l px-2 text-white font-bold disabled:from-gray-400 disabled:to-gray-700' disabled={product.every(item => item.selected === false)}>
            Out of stock
          </button>
          <button onClick={() => { handleActions("delete") }} className='bg-gradient-to-r from-purple-500 to to-red-500 active:bg-gradient-to-l px-2 text-white font-bold disabled:from-gray-400 disabled:to-gray-700' disabled={product.every(item => item.selected === false)}>
            Delete All
          </button>

          <div className="relative w-[150px]">
            <button ref={sortBtnRef} onClick={(e) => { setSortMenu(!sortMenu) }} className='w-full  bg-gradient-to-r from-purple-500 flex gap-2  justify-center items-center to-red-500 active:bg-gradient-to-l  text-white font-bold'>
              <span><PiArrowsDownUpBold color='white' stroke={2} /> </span>Sort by
            </button>
            <div className={`w-full py-2 bg-white absolute ${sortMenu ? "block" : "hidden "}`}>
              <ul>
                <li>
                  <button className='w-full border-t-2 border-b-2  text-center hover:bg-gray-300' onClick={() => { handleActions("lotohiprice") }}>
                    Low to High (Price)
                  </button>
                </li>
                <li>
                  <button className='w-full border-t-2 border-b-2  text-center hover:bg-gray-300' onClick={() => { handleActions("hitoloprice") }}>
                    Hight to Low (Price)
                  </button>
                </li>
                <li>
                  <button className='w-full border-t-2 border-b-2  text-center hover:bg-gray-300' onClick={() => { handleActions("lotohistock") }}>
                    Low to High (stock)
                  </button>
                </li>
                <li>
                  <button className='w-full border-t-2 border-b-2  text-center hover:bg-gray-300' onClick={() => { handleActions("hitolostock") }}>
                    Hight to Low (stock)
                  </button>
                </li>
                <li>
                  <button className='w-full border-t-2 border-b-2  text-center hover:bg-gray-300' onClick={() => { handleActions("remove") }}>
                    Remove sort
                  </button>
                </li>
              </ul>
            </div>
          </div>


          <div className="relative w-[170px] ">
            <button ref={filterBtnRef} onClick={(e) => { setFilterMenu(!filterMenu) }} className='w-[170px] bg-gradient-to-r from-purple-500 flex gap-2 justify-center items-center to-red-500 active:bg-gradient-to-l px-2 text-white font-bold'>
              <PiArrowsDownUpBold color='white' stroke={2} /> Filter
            </button>
            <div ref={filterRef} className={`w-[170px] py-1 bg-white absolute ${filterMenu ? "block" : "hidden"}`}>
              <ul>
                <li>
                  <button onClick={() => { handleActions("stocklt10") }} disabled={deactiveFilter} className='w-full disabled:bg-gray-400 border-t-2 border-b-2  text-center hover:bg-gray-300'>Stock &lt; 10</button>
                </li>
                <li>
                  <button onClick={() => { handleActions("stockgteq10&lt50") }} disabled={deactiveFilter} className='w-full disabled:bg-gray-400 border-t-2 border-b-2  text-center hover:bg-gray-300'>Stock &gt;= 10 and &lt; 50</button>
                </li>
                <li>
                  <button onClick={() => { handleActions("stockgteq50&lt100") }} disabled={deactiveFilter} className='w-full disabled:bg-gray-400 border-t-2 border-b-2  text-center hover:bg-gray-300'>Stock &gt;= 50 and &lt; 100</button>
                </li>
                <li>
                  <button onClick={() => (handleActions("remove"))} className='w-full border-t-2 border-b-2  text-center hover:bg-gray-300'>Remove Filter</button>
                </li>
              </ul>

            </div>
          </div>
        </div>
        <div className='w-14'>
        <button onClick={handleVisiblity} className='bg-gradient-to-r from-purple-500 to-red-500 active:bg-gradient-to-l px-1 text-white font-bold w-full'>Add</button>
        </div>
      </div>

      <div className="grid grid-cols-[2vw_6vw_59vw_8vw_8vw_17vw] w-screen px-[3px] gap-x-[3px] mx-2 mt-3 mb-1 bg-gray-200 text-white">
        <div className=' bg-blue-700 flex justify-center pr-[3px]'><input type="checkbox" name="select" id="" onChange={handleSelectAll} checked={product.length > 0 && product.every((item) => item.selected)} /></div>
        <div className='text-center bg-blue-700'>Images</div>
        <div className='text-center bg-blue-700'>Info</div>
        <div className='text-center bg-blue-700'>Price(in Rs)</div>
        <div className='text-center bg-blue-700'>Stock</div>

        <div className='text-center bg-blue-700'>Action</div>
      </div>
      {
        
        product.length>0 ? <div>

        <div className='grid gap-y-[2px]  mt-[1px]  mx-2 bg-gray-200'>
          {
            prductPerPage.map(item => {
              return (

                <div key={item._id} className='grid gap-x-[3px] grid-cols-[2vw_6vw_59vw_8vw_8vw_17vw] px-[3px] w-screen py-[1px] '>
                  <div className={`${item.stock <= 10 ? "bg-red-300 " : "bg-white"} flex justify-center pr-[3px]`}><input type="checkbox" name="select" id="" onChange={(e) => { handleSelect(e, item._id) }} checked={item.selected} /></div>
                  <div className={`${item.stock <= 10 ? "bg-red-300 " : "bg-white"} flex justify-center items-center`}>
                    {item.file ?
                      <img src={`https://stock-wise-1.onrender.com/images/${item.file}`} className='w-20 h-[64px] object-contain' alt="product image" />
                      : <div className="w-20 h-[64px] bg-gray-400 flex items-center justify-center">No Image</div>}
                  </div>
                  <div className={`${item.stock <= 10 ? "bg-red-300 " : "bg-white"} px-2 h-[72px]`}>
                    <Link to={item.sku} className='hover:underline'> <div>{item.product_name}</div></Link>
                    <div className='text-xs text-gray-500'>SKU:{item.sku}</div>
                    <div className='w-[300px] overflow-hidden whitespace-nowrap text-ellipsis  text-gray-500'>{item.product_description}</div>
                  </div>
                  <div className={`${item.stock <= 10 ? "bg-red-300 " : "bg-white"} flex justify-center items-center`}>{(item.product_price).toLocaleString("en-IN")}</div>
                  <div className={`${item.stock <= 10 ? "bg-red-300 " : "bg-white"}  flex flex-col justify-center items-center`}>{item.stock.toLocaleString("en-IN")}
                    {item.stock <= 10 && <span className="w-[110px] flex font-bold"><IoIosWarning size={"20px"} color='yellow' />Low Stock</span>}
                  </div>
                  <div className={`${item.stock <= 10 ? "bg-red-300 " : "bg-white"} flex justify-center items-center gap-3`}>
                    <button className='bg-blue-500 active:bg-blue-700 flex' onClick={() => (handleEditShow(item._id))}><LiaEdit size={30} /></button>
                    <button className='bg-blue-500 active:bg-blue-700 flex' onClick={() => { handleDelete(item._id) }}> <AiFillDelete size={30} /> </button>
                  </div>
                </div>
              )

            })
          }

        </div>
        <div className='px-2 flex gap-x-2 mt-2'>
          <button onClick={() => setPage(page - 1)} className='flex px-2 items-center bg-gray-200 disabled:bg-gray-500' disabled={page === 0}> <FaLessThan /> </button>
          <span> {page + 1} of {totalPages} </span>
          <button onClick={() => setPage(page + 1)} className='flex px-2 items-center bg-gray-200 disabled:bg-gray-500' disabled={page === totalPages - 1}> <FaGreaterThan /> </button>
          <span>Rows per page</span>
          <select onChange={handleChange} name="rowsPerPage" id="" className='bg-white'>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
      </div> : <div className='mx-2'>No Products</div>
      }


      <div className={`h-[90vh] z-10 bg-black bg-opacity-40 w-[92vw] fixed top-[42px]  shadow-2xl left-[4vw] ${visible ? `block` : `hidden`}`}>
        <button className='absolute top-1 right-1 ' onClick={() => { setVisible(false), setEdit(false) }}><RxCrossCircled size={45} color='white' strokeWidth={1} /></button>
        <div className="w-[90%] mx-auto my-[2%]  bg-white flex flex-col items-center py-7">
          <form >
            <div className="w-[70vw]">
              <input type="text" onChange={handleChange} value={form.product_name} name="product_name" id="" placeholder='Enter product title' autoComplete='off' required className='w-full  p-2    border-2 border-blue-700 focus:outline-none' />
              {error.product_name && <div className='text-red-700 font-bold'>{error.product_name}</div>}
            </div>

            <div className="input-label  my-3 w-[70vw]">
              <input type="text" onChange={handleChange} value={form.product_price} name="product_price" id="" placeholder='Enter product price' autoComplete='off' required className='w-full p-2  border-2 border-blue-700 focus:outline-none' />
              {error.product_price && <div className='text-red-700 font-bold'>{error.product_price}</div>}

            </div>
            <div className="input-label my-3 w-[70vw]">
              <input type="text" onChange={handleChange} value={form.stock} name="stock" id="" placeholder='Enter stock' autoComplete='off' required className='w-full p-2  border-2 border-blue-700 focus:outline-none' />
              {error.stock && <div className='text-red-700 font-bold'>{error.stock}</div>}

            </div>

            <div className="input-label  my-3 w-[70vw]">
              <textarea onChange={handleChange} value={form.product_description} rows={5} name="product_description" id="" placeholder='Enter product description' autoComplete='off' className='w-full p-2    border-2 border-blue-700 focus:outline-none' />
            </div>
          </form>

          <div className='w-[70vw]'>

            <button onClick={openFileBox} className=" h-10 px-5 text-center bg-blue-500 active:bg-blue-300 justify-self-start item-self-start">Add images
              <input onChange={handleFileChange} ref={fileRef} type="file" name="product_image" id="" className="hidden" accept='.png, .jpg, .jpeg' />
            </button>
            {form.file?.name ? <span>&nbsp;&nbsp;{form?.file.name}</span> : <span>&nbsp;&nbsp; No File Chosen</span>}
          </div>
          {<button onClick={edit ? handleEdit : handleSave} className='bg-gradient-to-r from-purple-500 to-red-500 active:bg-gradient-to-l w-24 h-10 text-center text-xl font-bold text-white'>{edit ? "Edit" : "Save"}</button>}
        </div>
      </div>
    </>
  )
}

export default Dshboard
