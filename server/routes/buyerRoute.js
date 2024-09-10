import express from "express"
import Buyer from "../models/buyer.js"
import pdf from "html-pdf"
import User from "../models/user.js"
import Product from "../models/inventory.js"
const router = express.Router()

router.get("/", async (req, res) => {
    try {

        const buyers = await Buyer.find({ addBy: req.user._id })

        res.status(200).json(buyers)
    } catch (error) {
        res.status(400).send("error")
        console.log(error)

    }

})

router.post("/save", async (req, res) => {
    let { buyer_name, address, state, pincode } = req.body
    if (address === "") {
        address = undefined
        state = undefined
        pincode = undefined
    }
    try {

        await Buyer.create({
            buyer_name,
            address,
            state,
            addBy: req.user._id,
            pincode
        })
        res.status(200).send("created")
    } catch (error) {
        res.status(400).send("error")
    }
})

router.post("/generate-invoice", async (req, res) => {
    let sno = 0;
    const seller = await User.findById(req.user._id)
    let arr = req.body.bill
    let buyerDetails = req.body.buyerDetails
    let total = req.body.total
    const sales = Number(total.bill)
    const unit = Number(total.qty)
    const date = new Date()
    const formatedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    const html =
        `
    <!doctype html>
<html lang="en">

<head>
  <style>
  body{
    font-family:sans-serif;
  }
    table{
          background:#e5e7eb;
          margin-left:5px;
          margin-top:30px;
    }
    th{
        background-color: #1d4de8;
        color:white;
        font-size:12px;
    }
    tr{
        background-color: white;
        text-align:center;
    }
    .total{
        background-color:#3b82f6;
        color:white;
        text-align:center;
    }
    
  </style>
</head>

<body>
    
   <div>
        <div style="margin-left:5px;">
            <div style="font-weight:bold;font-size:25px; margin-top:20px;">${seller.name} <span style="font-size:15px; margin-left:400px; font-weight:normal;">Date:${formatedDate}</span></div>
            <div>${seller.address}</div>
            <div>${seller.state}</div>
            <div>${seller.pincode}</div>
        </div>

        <div style="margin-top:15px; margin-left:5px;">Bill To</div>
            <div style="margin-top:5px; margin-left:5px;">
            <div style="font-weight:bold;font-size:15px;">${buyerDetails.name}</div>
            <div>${buyerDetails.address ? ` <div>${buyerDetails.address}</div>` : ""}</div>
            <div>${buyerDetails.state ? ` <div>${buyerDetails.state}</div>` : ""}</div>
            <div>${buyerDetails.pincode ? ` <div>${buyerDetails.pincode}</div>` : ""}</div>
   
        </div>
    </div>

   


    <table>

    <colgroup>
        <col style="width:20px; text-align:center;">
        <col style="width:700px; text-align:center;">
        <col style="width:200px; text-align:center;">
        <col style="width:100px; text-align:center;">
        <col style="width:100px; text-align:center;">
    </colgroup>

    <tr>
        <th>S.No</th>
        <th>Product</th>
        <th>Price (In Rs)</th>
        <th>Qty</th>
        <th>Total</th>
    </tr>

    <tbody>
      ${arr.map((item, i) => {
            sno = i + 1
            return (
                `<tr>
            <td>${i + 1}</td>
            <td style="text-align:left; padding-left:12px; padding-right:12px;">${item.product_name}</td>
            <td>${Number(item.product_price).toLocaleString("en-IN")}</td>
            <td>${Number(item.qty).toLocaleString("en-IN")}</td>
            <td>${Number(item.product_price * item.qty).toLocaleString("en-IN")}</td>
         </tr>`

            )
        }).join("")}
         <tr class="total">
            <td>${sno + 1}</td>
            <td style="text-align:left; padding-left:12px; padding-right:12px;">Total</td>
            <td>${Number(total.price).toLocaleString("en-IN")}</td>
            <td>${Number(total.qty).toLocaleString("en-IN")}</td>
            <td>${Number(total.bill).toLocaleString("en-IN")}</td>

        </tr>
    </tbody>

</body>

</html>
    `



    pdf.create(html).toBuffer(async (err, buffer) => {
        try {
            await User.findByIdAndUpdate(req.user._id,
                {
                    $inc: { sales: sales, unitSold: unit }
                }
            )


            await Buyer.updateOne({ uid: buyerDetails.uid },
                { $inc: { purchasedAmount: sales, purchasedQuantity: unit } }
            )
            arr.forEach(async item => {
                let qty = Number(item.qty)
                let price = Number(item.product_price)
                let total = qty * price
                await Product.updateOne({ sku: item.sku },
                    { $inc: { stock: -qty, unitSold: qty, sales: total } }
                )
            });
            res.setHeader('Content-Type', "application/pdf")
            res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf")
            res.status(200).send(buffer)
        }catch(error) {
            res.status(400).send("error")
            console.log(error)

        }
        if (err) {
            res.json("error")
        }

    })


})

router.put("/edit", async (req, res) => {
    let { buyer_name, uid, address, state, pincode } = req.body
    if (address === "") {
        address = undefined
        state = undefined
        pincode = undefined
    }

    try {
        await Buyer.updateOne({ uid: uid }, {
            $set: {
                buyer_name,
                address,
                state,
                pincode
            }
        }).then(() => console.log("done"))
        res.status(204).send("Updated")
    } catch (error) {
        res.status(400).send("error")
    }

})
export default router
