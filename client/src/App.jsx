import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login from "./routes/Login"
import Home from './routes/Home'
import Signup from './routes/Signup'
import Dashboard from "./routes/Dashboard"
import { useState, useEffect } from "react"
import Product from "./routes/Product"
import Billing from "./routes/Billing"
import AddBuyer from "./routes/AddBuyer"
import Profile from "./routes/Profile"

function App() {

  const [user, setUser] = useState({})
  const getUser = async () => {
    let res = await fetch(`/api/auth`, { headers: { "Cache-control": "no-cache", Pragma: "no-cache" }, credentials: "include" })
    let cred = await res.json()
    console.log(cred,"res")
    setUser(cred)
  }
  useEffect(() => {
    getUser()
  }, [])
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />
    },
    {
      path: "/login",
      element: <Login user={user} />
    },
    {
      path: "/signup",
      element: <Signup />
    },
    {
      path: "/dashboard",
      element: <Dashboard/>
    },
    {
      path: "dashboard/:sku",
      element: <Product/>
    },
    { 
      path:"/billing",
      element:<Billing/>
    },
    { 
      path:"/billing/addbuyer",
      element:<AddBuyer/>
    },
    {
      path:"/profile",
      element:<Profile/>
    }
  ])


  return (
    <>

      <RouterProvider router={router} />
    </>
  )
}

export default App
