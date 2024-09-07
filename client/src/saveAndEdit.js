const api = import.meta.env.VITE_API_URL


export const productSaveAndEdit = async (form, setError, setVisible, endpoint, METHOD) => {
  let newError = { product_name: "", product_price: "", stock: "" }
  if (form.product_name === "") {
    newError.product_name = "Product's name is required"
    setError(newError)

  }
  else if (form.product_name.length < 3) {
    newError.product_name = "Product's name length must be greater than 2"
    setError(newError)

  } else {
    newError.product_name = ""
    setError(newError)

  }
  if (form.product_price === "") {
    newError.product_price = "Product's price is required"
    setError(newError)

  } else if (isNaN(form.product_price)) {
    newError.product_price = "Product's price must be a number"
    setError(newError)
  } else {
    newError.product_price = ""
    setError(newError)

  }
  if (isNaN(form.stock)) {
    newError.stock = "Product's stock must be a number"
    setError(newError)
  } else {
    newError.stock = ""
    setError(newError)
  }
  if (newError.product_name === "" && newError.product_price === "" && newError.stock === "") {
    let data = new FormData()
    data.append("product_name", form.product_name)
    data.append("product_price", form.product_price)
    data.append("stock", form.stock)
    data.append("product_description", form.product_description)
    data.append("file", form.file)
    if (METHOD === "PUT") {
      data.append("oldFile", form.oldFile)
      data.append("id", form.id)
    }


    let res = await fetch(`${api}/product/${endpoint}`, { method: METHOD, body: data, credentials: "include" })



    setVisible(false)
    window.location.reload()
  }
}



export const billSaveAndEdit = (form, setForm, setError, setVisible, bill, setBill, setDefaultprice, stock,setEdit) => {
  let newError = { buyer_uid: "", sku: "", product_price: "" }
  console.log(form.buyer_uid === "Select Buyer")
  if (form.buyer_uid === "Select Buyer") {
    newError.buyer_uid = "Buyer'S name is required"
    console.log(newError)
    setError(newError)
  } else {
    newError.buyer_uid = ""
    setError(newError)
  }
  if (form.sku === "Select SKU") {
    newError.sku = "Select SKU"
    setError(newError)
  }
  else {
    newError.sku = ""
    setError(newError)
  }

  if (form.product_price === "") {
    newError.product_price = "Product's price is required"
    setError(newError)
  }
  else if (isNaN(form.product_price)) {
    newError.product_price = "Product's price must be number"
    setError(newError)
  } else {
    newError.product_price = ""
    setError(newError)
  }
  if (form.qty === "") {
    newError.qty = "Product's quantity is required"
    setError(newError)
  }
  else if (isNaN(form.qty)) {
    newError.qty = "Product's quantity must be number"
    setError(newError)
  } else {
    let qty = Number(form.qty)
    if (qty > stock) {
      newError.qty = "Not enough stock"
      setError(newError)
    } else {
      newError.qty = ""
      setError(newError)
    }
  }

  if (newError.buyer_uid === "" && newError.sku === "" && newError.product_price === "" && newError.qty === "") {

    setBill([...bill, form])
    setForm({ buyer_uid: form.buyer_uid, sku: "Select SKU", product_name: "", product_price: "", qty: "" })
    setError({})
    setVisible(false)
    setDefaultprice(0)
    setEdit(false)






  }
}






export const buyerSaveAndEdit = async (form, setBuyerError, setAddressError, setStateError, setPincodeError, METHOD,navigate) => {
  let newError = { buyer_name: "", address: "", state: "", pincode: "" }
  console.log("form",form)
  if (form.buyer_name === "") {
    newError.buyer_name = "Buyer's name is required"
    setBuyerError(newError.buyer_name)
  } else {
    newError.buyer_name = ""
    setBuyerError(newError.buyer_name)
  }


  if (form.address !== "") {
    if (form.state === "" && form.pincode == "") {
      newError.state = "State is required"
      newError.pincode = "Pincode is required"
      setStateError(newError.state)
      setPincodeError(newError.pincode)


    } if (form.state === "" && (form.pincode === "" || form.pincode !== "")) {
      newError.state = "State is required"
      setStateError(newError.state)
    } else if (form.state !== "" && (form.pincode === "" || form.pincode !== "")) {
      newError.state = ""
      setStateError(newError.state)
    } if (form.pincode === "" && (form.state === "" || form.state !== "")) {
      newError.pincode = "Pincode is required"
      setPincodeError(newError.pincode)
    } else if (form.pincode !== "" && (form.state === "" || form.state !== "")) {
      newError.pincode = ""
      setPincodeError(newError.pincode)

    }
  }
  if (form.state !== "") {
    if (form.address === "" && form.pincode == "") {
      newError.address = "Address is required"
      newError.pincode = "Pincode is required"
      setAddressError(newError.address)
      setPincodeError(newError.pincode)


    } if (form.address === "" && (form.pincode === "" || form.pincode !== "")) {
      newError.address = "Address is required"
      setAddressError(newError.address)
    } else if (form.address !== "" && (form.pincode === "" || form.pincode !== "")) {
      newError.address = ""
      setAddressError(newError.address)
    } if (form.pincode === "" && (form.address === "" || form.address !== "")) {
      newError.pincode = "Pincode is required"
      setPincodeError(newError.pincode)

    } else if (form.pincode !== "" && (form.address === "" || form.address !== "")) {
      newError.pincode = ""
      setPincodeError(newError.pincode)

    }
  }
  if (form.pincode !== "") {
    console.log(form.pincode.length!==6)
    if (isNaN(form.pincode) || form.pincode.length !== 6) {
      newError.pincode = "Please enter valid pincode"
      setPincodeError(newError.pincode)
    }


    if (form.address === "" && form.state == "") {
      newError.address = "Address is required"
      newError.state = "State is required"
      setAddressError(newError.address)
      setStateError(newError.state)

    }
    if (form.address === "" && (form.state === "" || form.state !== "")) {
      newError.address = "Address is required"
      setAddressError(newError.address)
    } else if (form.address !== "" && (form.state === "" || form.state !== "")) {
      newError.address = ""
      setAddressError(newError.address)
    } if (form.state === "" && (form.address === "" || form.address !== "")) {
      newError.state = "State is required"
      setStateError(newError.state)
    } else if (form.state !== "" && (form.address === "" || form.address !== "")) {
      newError.state = ""
      setStateError(newError.state)
    }
  }
  if (newError.buyer_name === "" && newError.address === "" && newError.state === "" && newError.pincode === "") {

    await fetch(`${api}/buyer`, { method: METHOD, headers: { "Content-type": "application/json" }, credentials: "include", body: JSON.stringify(form) })
    if(METHOD==="PUT"){
        alert("Details are updated")
        navigate("/billing")
      }else window.location.reload()
  }
}