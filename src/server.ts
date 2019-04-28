import * as express from "express";
import * as config from "config";
import * as mongoose from "mongoose";
import * as path from "path";

import auth from "./routes/api/auth";
import users from "./routes/api/users";
import job from "./routes/api/job";
import account from "./routes/api/account";
import user from "./routes/api/user";

import test from "./initDatabase";

const app = express();

app.use(express.json());

app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/job", job);
app.use("/api/account", account);
app.use("/api/user", user);


//Static file declaration
app.use(express.static(path.join(__dirname, 'client/build')));

//production mode
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  //
  app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname = 'client/build/index.html'));
  })
}
//build mode
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/public/index.html'));
})


const db = config.get("MongoURI") as string;

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
  await test();
});
