import Inventory from "../models/inventory.js";
import express from "express"
import path from "path"
import multer from "multer"
import fs from "fs"
const router = express.Router()
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./public/images")
    },
    filename: function (req, file, cb) {

        return cb(null, `${file.originalname.split(".")[0]}-${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({ storage })
router.get("/", async (req, res) => {

    try {

        let product = await Inventory.find({ addBy: req.user._id })
        
        res.status(200).json({ product: product})
    } catch (error) {
        res.status(400).send("error")
    }
})
router.post("/add-product", upload.single("file"), async (req, res) => {
    const { product_name, product_price, product_description, stock } = req.body
    let num = Date.now().toString()
    let sku = req.user.username.slice(1, 3) + product_name.slice(0, 2) + num.slice(-4)

    try {
        await Inventory.create({
            product_name: product_name,
            product_price: product_price,
            product_description: product_description,
            stock: stock ? Number(stock) : undefined,
            sku: sku.toLowerCase(),
            sales:0,
            unitSold:0,
            file: req.file?.filename,
            addBy: req.user._id

        })

        res.status(201).json({ msg: "true" })
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: "some error occured" })
    }
})



router.put("/edit", upload.single("file"), async (req, res) => {
    const { product_name, product_price, product_description, stock, oldFile, id } = req.body

    if (fs.existsSync(`./backend/public/images/${oldFile}`) && req.file) {
        fs.unlink(`./backend/public/images/${oldFile}`, (err) => {
            err ? console.log("delete error", err) : console.log("file deleted successfully")
        })
    }
    try {
        await Inventory.findByIdAndUpdate(id, {
            $set: {
                product_name: product_name,
                product_price: product_price,
                product_description: product_description,
                stock: stock ? Number(stock) : undefined,
                file: req.file?.filename,
                addBy: req.user._id

            }
        }, { new: true })


        res.status(201).json({ msg: "updated success fully" })
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: "some error occured updateing" })
    }

})

router.put("/updateSelected", async (req, res) => {
    let { list } = req.body

    await Inventory.updateMany(
        { _id: { $in: list } },
        { $set: { stock: 0 } }
    )
    res.status(201).send("Updated succesfully")


})

router.delete("/delete", async (req, res) => {
    fs.unlink(`./public/images/${req.body.file}`, (err) => {
        err ? console.log(err) : console.log("image deleted successfully")
    })
    try {
        await Inventory.findByIdAndDelete(req.body.id)
    } catch (error) {
        console.log(error)
    }


    res.status(200).send("deleted")
})

router.delete("/deleteSelected", async (req, res) => {
    let array = []
    let file = []
    for (let item of req.body) {

        array.push(item._id)

        item?.file && file.push(item?.file)
    }
    let results = await Inventory.deleteMany(
        { _id: { $in: array } }
    )
    file.forEach(element => {
        fs.unlink(`./public/images/${element}`,(err)=>{
            err ? console.log(err) : console.log("all images are deleted")
        })
    });
    
    res.status(200).send("deleted successfull")

})

router.get("/:sku", async (req, res) => {
    if (!req.user) {
        res.json({ error: "please log in" })
     
    } else {
       const product = await Inventory.findOne({
            sku:req.params.sku
        })
        res.status(200).json(product)
       
    }
})


export default router