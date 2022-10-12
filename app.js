const express =  require('express')
const mongoose = require('mongoose');
const siteRouter = require('./routes/siteRoutes');
const userRouter = require('./routes/userRoutes');
const url = 'mongodb://localhost/PasswordManager'
const app = express()

mongoose.connect(url, {useNewUrlParser:true})
.then(() => {
    app.listen(9000, () => {
        console.log('Server started on port no 9000')
    })
  })
  .catch((e) => console.log(e));

app.use("/users", userRouter)
app.use("/sites", siteRouter)

