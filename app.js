const express = require("express")
const morgan = require("morgan")
const mongoose = require("mongoose")
const submissionRouter = require("./api/routers/submission")
const dotenv = require("dotenv")
dotenv.config()

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true })

const app = express()
app.use(morgan("dev"))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Token"
  )
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
    return res.status(200).json({})
  }
  next()
})

app.use("/submissions", submissionRouter)
app.listen(process.env.PORT, () =>
  console.log(`Listening on port ${process.env.PORT}`)
)
