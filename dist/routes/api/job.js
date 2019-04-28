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
const Jobs_1 = require("../../models/Jobs");
const api_1 = require("../../middleware/api");
const router = express_1.Router();
const API = {
    get: {
        getJobs: {
            access: api_1.ApiAccess.GUEST,
            execute: (query) => __awaiter(this, void 0, void 0, function* () {
                const jobs = yield Jobs_1.default.find({})
                    .select("-_id -__v")
                    .exec();
                return jobs;
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
