require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// MongoDB setup
var mongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-gtauj.gcp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, {
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
mongoose.connection;

// Express setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Express routes setup
app.use("/posts", require("./routes/posts"));

// Running the server
app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
);
