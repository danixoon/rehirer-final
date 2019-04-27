"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
app.get("/", (req, res) => {
    res.send("Hello Typescript!");
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening at ${port} port`);
});
