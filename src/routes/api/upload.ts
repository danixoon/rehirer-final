import * as express from "express";
import * as multer from "multer";
import Image from "../../models/Image";

import * as bcrypt from "bcrypt";
import { Router, RequestHandler, Response } from "express";
import User from "../../models/User";
import * as jwt from "jsonwebtoken";

import Job, { IJobModel, IJob } from "../../models/Job";
import createApiMiddleware, { ApiAccess, IAPI, apiError } from "../../middleware/api";

import * as joi from "joi";
import UserData from "../../models/UserData";
import JobRespond from "../../models/JobRespond";
import AccountData from "../../models/AccountData";
import * as fs from "fs";
// import * as path from "path";
// import { apiError } from "../../middleware — backup/api";

const router = Router();

const storage = multer.diskStorage({
  destination: async (req: any, file, cb) => {
    const p = `./upload/images/${req.userId}/`;
    if (!fs.existsSync(p)) await new Promise((res, rej) => fs.mkdir(p, err => (err ? rej(err) : res())));
    cb(null, p);
  },
  filename: async (req: any, file, cb) => {
    const re = /(?:\.([^.]+))?$/;
    const ext = re.exec(file.originalname)[1];
    cb(null, `${await bcrypt.genSalt(10)}_${Date.now()}.${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") cb(null, true);
  else cb(null, false);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter
});

const API: IAPI = {
  post: {
    image: {
      access: ApiAccess.TOKEN,
      schema: {},
      execute: async ({ count, offset, id }, req, res) => {
        req.userId = id;
        const err = await new Promise(next => upload.single("data")(req, res, next));
        if (err) throw err;
        if (!req.body.name || !req.file) throw apiError("data required", 400);
        const newImage = new Image({ name: req.body.name, data: req.file.path });
        const result = (await newImage.save()) as any;
        return { url: result.data };
      }
    }
  }
};

// @route WHATEVER api/job
// @decs ALL WHAT U WANT
// @access Public
const middleware = createApiMiddleware(API);
router.all("/:method", middleware);

export default router;

// export default

// const ImageRouter = express.Router();
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./upload/images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + file.originalname);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") cb(null, true);
//   else cb(null, false);
// };

// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5
//   },
//   fileFilter
// });

// ImageRouter.route("/image").post(upload.single("data"), async (req, res, next) => {
//   console.log(req.body);
//   if (!req.body.name || !req.file) return res.status(400).send({ msg: "incorrect query" });
//   const newImage = new Image({ name: req.body.name, data: req.file.path });
//   try {
//     const result = await newImage.save();
//     res.status(200).send({ document: result });
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// export default ImageRouter;
