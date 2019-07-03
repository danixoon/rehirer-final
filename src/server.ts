import * as express from "express";
import * as mongoose from "mongoose";
import * as path from "path";
import respond from "./routes/api/respond";
import job from "./routes/api/job";
import account from "./routes/api/account";
import user from "./routes/api/user";
import upload from "./routes/api/upload";
import images from "./routes/upload/images";

import * as dotenv from "dotenv";

import smpt from "./middleware/smpt";

import * as fs from "fs";

dotenv.config();

const app = express();

async function init() {
  app.use(smpt);

  app.use("/api/respond", respond);
  app.use("/api/job", job);
  app.use("/api/account", account);
  app.use("/api/user", user);

  app.use("/api/upload", upload);
  
  app.use("/upload/images", images);

  if (!process.env.MONGO_URI || !process.env.JWT_SECRET) throw "ENV VARIABLES INCORRECT";

  //production mode
  if (process.env.NODE_ENV === "production") {
    console.log("yeah");

    app.use(express.static(path.join(__dirname, "../client/build")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/build/index.html"));
    });
  }

  const db = process.env.MONGO_URI as string;

  mongoose
    .connect(db, {
      useCreateIndex: true,
      useNewUrlParser: true
    })
    .then(() => console.log("MongoDB connected"))
    .catch(console.log);

  const port = process.env.PORT || 5000;

  app.listen(port, async () => {
    console.log(`Server listening at ${port} port`);
  });
}

init();
