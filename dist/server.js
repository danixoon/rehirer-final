"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const path = require("path");
const auth_1 = require("./routes/api/auth");
const users_1 = require("./routes/api/users");
const job_1 = require("./routes/api/job");
const account_1 = require("./routes/api/account");
const user_1 = require("./routes/api/user");
const fs = require("fs");
const app = express();
app.use(express.json());
app.use("/api/auth", auth_1.default);
app.use("/api/users", users_1.default);
app.use("/api/job", job_1.default);
app.use("/api/account", account_1.default);
app.use("/api/user", user_1.default);
//Static file declaration
app.use(express.static(path.join(__dirname, "client/build")));
//production mode
if (process.env.NODE_ENV === "production") {
    console.log("yeah");
    // if (!process.env.MONGO_URI || !process.env.JWT_SECRET) throw "ENV VARIABLES INCORRECT";
    // fs.mkdirSync("../config");
    const configData = { MongoURI: process.env.MONGO_URI, jwtSecret: process.env.JWT_SECRET };
    fs.writeFileSync("../config/default.json", JSON.stringify(configData));
    app.use(express.static(path.join(__dirname, "client/build")));
    //
    app.get("*", (req, res) => {
        res.sendfile(path.join((__dirname = "client/build/index.html")));
    });
}
//build mod
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/public/index.html"));
});
const db = config.get("MongoURI");
mongoose
    .connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true
})
    .then(() => console.log("MongoDB connected"))
    .catch(console.log);
const port = process.env.PORT || 5000;
app.listen(port, () => __awaiter(this, void 0, void 0, function* () {
    console.log(`Server listening at ${port} port`);
    // await test();
}));
