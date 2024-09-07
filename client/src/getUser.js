import { useNavigate,Link } from 'react-router-dom'
const api = import.meta.env.VITE_API_URL
const getUser = async (navigate) => {
  try {
    
    let response = await fetch(`${api}/auth`, { "Cache-Cotrol": "no-cache", "Pragma": "no-cache", credentials: "include" })
    let user = await response.json()

    let arr = Object.keys(user)
    console.log("array",arr, user)
    if (arr.includes("error")) {
      navigate(`/login`)
    }
    
  } catch (error) {
    console.log("error fetch",error)
  }
  }
export default getUser
