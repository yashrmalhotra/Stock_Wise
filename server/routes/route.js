import express from "express";
import User from "../models/user.js";
import Inventory from "../models/inventory.js";

const router = express.Router();



router.get("/profile", async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        res.json(user)
    } catch (error) {
        res.send("error")
    }
})
router.put("/",async (req,res)=>{
    const data = req.body
    try {
        await User.findByIdAndUpdate(req.user._id,
            {$set:{
                name:data.name,
                email:data.email,
                address:data.address,
                state:data.state,
                pincode:data.pincode
            }}
        )
        res.status(204).send("Updated")
    } catch (error) {
        res.status(400).send("error")
        console.log(error)

    }

})

router.post("/signup", async (req, res) => {
    const { name, username, email, address, colony, state, pincode, password } = req.body

    try {
        await User.create({ name, username, email, address, state, pincode, password })
        res.status(201).json({ message: true })

    } catch (err) {
        let a = Object.keys(err.errorResponse.keyPattern)

        if (a.includes("username")) {
            res.status(409).json({ error: "Username already exists" })
        } else if (a.includes("email")) {
            res.status(409).json({ error: "Email already exists" })
        }

    }

})
router.post("/login", async (req, res) => {
    const { username, password } = req.body
    console.log(req.body)
    try {
        const user = await User.verifyAndGenerateToken(username, password)
        res.cookie("Token", user, {
            httpOnly: true, // Prevents JavaScript from accessing the cookie,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day
        });
        res.status(200).json({ message: "Founded" })
    } catch (err) {
        console.log(err)
        res.status(404).json({ error: "Username or Password is wrong" })
    }
})
router.get("/logout", (req, res) => {
    res.clearCookie("Token")
    res.send("logged out")
})

export default router;
