import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Product = () => {
  const params = useParams()
  const [product, setProduct] = useState({})
  const navigate = useNavigate()
  const getDetails = async () => {
    let res = await fetch(`/api/product/${params.sku}`, { credentials: "include" })
    let data = await res.json()
    let keys = Object.keys(data)

    if (keys.includes("error")) {
      navigate("/login")
    }
    else {
      setProduct(data)
    }
  }
  useEffect(() => {
    getDetails()
  }, [])
  return (
    <>
    <div>

    </div>
      <div className='flex flex-col w-full bg-slate-200 items-center py-2 h-[30vh]'>
        <div className="h-[180px] w-[180px] flex justify-center">
          {product.file ? <img src={`https://stock-wise-1.onrender.com/images/${product.file}`} width={"220px"} height={"180px"} className='object-contain' alt="product" /> : <span className='h-full w-full bg-gray-500  flex items-center justify-center text-3xl font-bold '>No Image</span>}
        </div>
      </div>

      <div className='bg-slate-200 w-full min-h-[70vh] p-5'>
        <div className="bg-blue-200 border-[1px] border-black flex min-h-11">
          <div className='bg-white w-[10vw] flex items-center px-2'>Product Name</div>
          <div className='min-h-11 w-[1px] bg-black'></div>
          <div className="w-[70vw] flex items-center px-2">{product.product_name}</div>
        </div>
        <div className="bg-blue-200 border-[1px] border-black flex min-h-11">
          <div className='bg-white w-[10vw] flex items-center px-2'>SKU</div>
          <div className='min-h-11 w-[1px] bg-black'></div>
          <div className="w-[70vw] flex items-center px-2">{product.sku}</div>
        </div>
        <div className="bg-blue-200 border-[1px] border-black flex min-h-11">
          <div className='bg-white w-[10vw] flex items-center px-2'>Price (In RS)</div>
          <div className='min-h-11 w-[1px] bg-black'></div>
          <div className="w-[70vw] flex items-center px-2">{(Number(product.product_price)).toLocaleString("en-IN")}</div>
        </div>
        <div className="bg-blue-200 border-[1px] border-black flex min-h-11">
          <div className='bg-white w-[10vw] flex items-center px-2'>Stock</div>
          <div className='min-h-11 w-[1px] bg-black'></div>
          <div className="w-[70vw] flex items-center px-2">{(Number(product.stock)).toLocaleString("en-IN")}</div>
        </div>
        <div className="bg-blue-200 border-[1px] border-black flex min-h-11">
          <div className='bg-white w-[10vw] flex items-center px-2'>Sales (in RS)</div>
          <div className='min-h-11 w-[1px] bg-black'></div>
          <div className="w-[70vw] flex items-center px-2">{(Number(product.sales)).toLocaleString("en-IN")}</div>
        </div>
        <div className="bg-blue-200 border-[1px] border-black flex min-h-11">
          <div className='bg-white w-[10vw] flex items-center px-2'>Unit Sold</div>
          <div className='min-h-11 w-[1px] bg-black'></div>
          <div className="w-[70vw] flex items-center px-2">{(Number(product.unitSold)).toLocaleString("en-IN") }</div>
        </div>

        <div className="bg-blue-200 border-[1px] border-black flex min-h-11">
          <div className='bg-white w-[10vw] flex items-center px-2'>Description</div>
          <div className='min-h-11 w-[1px] bg-black'></div>
          <div className="w-[70vw] flex items-center px-2">{product.product_description ? product.product_description : <span>N0 Description</span>}</div>
        </div>
      </div>

    </>
  )
}

export default Product
