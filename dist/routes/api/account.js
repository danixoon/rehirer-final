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
const bcrypt = require("bcrypt");
const config = require("config");
const express_1 = require("express");
const AccountData_1 = require("../../models/AccountData");
const jwt = require("jsonwebtoken");
const api_1 = require("../../middleware/api");
const joi = require("joi");
const router = express_1.Router();
const API = {
    get: {
        auth: {
            schema: {
                login: joi.string().required(),
                password: joi.string().required()
            },
            access: api_1.ApiAccess.GUEST,
            execute: ({ login, password }) => {
                return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
                    const user = yield AccountData_1.default.findOne()
                        .or([{ username: login }, { email: login }])
                        .and([{ password }])
                        .select("-_id -__v")
                        .exec();
                    if (user) {
                        const isMatch = yield bcrypt.compare(password, user.password);
                        if (!isMatch)
                            rej(api_1.apiError(400, "invalid credentials"));
                        jwt.sign({
                            id: user.id
                        }, config.get("jwtSecret"), { expiresIn: 3600 }, (err, token) => {
                            if (err)
                                rej(err);
                            res(Object.assign({ token }, user.toObject()));
                        });
                    }
                    else
                        rej(api_1.apiError(400, "invalid credentials"));
                }));
            }
        }
    }
};
// @route WHATEVER api/job
// @decs ALL WHAT U WANT
// @access Public
const middleware = api_1.default(API);
router.all("/:method", middleware);
exports.default = router;
