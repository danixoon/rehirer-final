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
const express_1 = require("express");
const AccountData_1 = require("../../models/AccountData");
const UserData_1 = require("../../models/UserData");
const api_1 = require("../../middleware/api");
const joi = require("joi");
const User_1 = require("../../models/User");
const router = express_1.Router();
const API = {
    get: {
        info: {
            schema: {
                username: joi.string().required()
            },
            access: api_1.ApiAccess.GUEST,
            execute: ({ username }) => __awaiter(this, void 0, void 0, function* () {
                const account = yield AccountData_1.default.findOne({ username }).exec();
                const user = yield User_1.default.findOne({ accountDataId: account.id }).exec();
                const result = yield UserData_1.default.findById(user.userDataId)
                    .select("-_id -__v")
                    .exec();
                if (result)
                    return result.toObject();
                else
                    throw api_1.apiError(404, "user not found");
                // result.toJSON();
            })
        }
    }
};
// @route WHATEVER api/job
// @decs ALL WHAT U WANT
// @access Public
const middleware = api_1.default(API);
router.all("/:method", middleware);
exports.default = router;
