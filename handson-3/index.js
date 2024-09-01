const express = require("express");
const userRouter = require("./routes/userRoutes");


const app = express();
const PORT = 4000;

app.use(express.json());

app.use("/users/", userRouter);

app.listen(PORT, ()=>{
    console.log("Listening to Port " + PORT);
})