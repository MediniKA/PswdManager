const express =  require('express')
const mongoose = require('mongoose');
const siteRouter = require('./routes/siteRoutes');
const userRouter = require('./routes/userRoutes');
const url = process.env.MONGO_URL
const port = process.env.PORT || 9000
const dotenv = require("dotenv")
const app = express()
const cors = require("cors")

dotenv.config()
app.use(express.json());


app.use(cors());

// app.use((req, res, next)=>{
//   console.log("HTTP Method - "+ req.method + ", URL -" +req.url)
//   next();
// })

app.use("/users", userRouter)
app.use("/sites", siteRouter)

mongoose.connect(process.env.MONGO_URL,)
.then(() => {
    app.listen(port, () => {
    
        console.log('Server started on port no '+port)
    })
  })
  .catch((e) => console.log(e));



