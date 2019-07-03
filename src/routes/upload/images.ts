import * as cloudinary from "cloudinary";

import { RequestHandler, Router } from "express";

const router = Router();

router.use("/:public_id", (req, res, next) => {
  const { public_id } = req.params;
  if (!public_id) return res.status(400).send({ msg: "id required" });
  const url = `http://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${public_id}`;
  res.redirect(url);

});


export default router;
