const express =  require('express')
const mongoose = require('mongoose');
const siteRouter = require('./routes/siteRoutes');
const userRouter = require('./routes/userRoutes');
const url = 'mongodb://localhost/PasswordManager'
const app = express()

app.use(express.json());

app.use((req, res, next)=>{
  console.log("HTTP Method - "+ req.method + ", URL -" +req.url)
  next();
})

app.use("/users", userRouter)
app.use("/sites", siteRouter)

mongoose.connect(url, {useNewUrlParser:true})
.then(() => {
    app.listen(9000, () => {
        console.log('Server started on port no 9000')
    })
  })
  .catch((e) => console.log(e));



