import * as cloudinary from "cloudinary";

import { RequestHandler, Router } from "express";
// import request from "requ"

const router = Router();
// const cloud = cloudinary.v2;

router.use("/:public_id", (req, res, next) => {
  const { public_id } = req.params;
  if (!public_id) return res.status(400).send({ msg: "id required" });

  // cloud.config({
  //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  //   api_key: process.env.CLOUDINARY_API_KEY,
  //   api_secret: process.env.CLOUDINARY_API_SECRET
  // });

  // res.setHeader("content-disposition", `attachment; filename=${public_id}`);
  // req.(`http://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/sample.jpg`).
  const url = `http://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${public_id}`;
  // res.set("Content-Disposition", "attachment;filename=" + url);
  res.redirect(url);
  // res.download(`http://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${public_id}`);
});
//
// const uploadImage: RequestHandler = (req, res, next) => {};

export default router;
