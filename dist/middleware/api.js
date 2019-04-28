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
const auth_1 = require("./auth");
const joi = require("joi");
function apiError(code, msg) {
    return {
        code,
        msg
    };
}
exports.apiError = apiError;
function executeMethod(method, query, res) {
    return new Promise((resolve, reject) => {
        if (method.schema) {
            const result = joi.validate(query, method.schema, { allowUnknown: true });
            if (result.error) {
                res.status(400).send({ msg: result.error.details[0].message });
                return reject(result.error);
            }
            query = result.value;
        }
        method
            .execute(query)
            .then(data => {
            res.status(200).send(data);
            return resolve(data);
        })
            .catch(err => {
            res.status(err.code || 500).send({ msg: err.msg || "error" });
            return reject(err);
        });
    });
}
var ApiAccess;
(function (ApiAccess) {
    ApiAccess[ApiAccess["GUEST"] = 0] = "GUEST";
    ApiAccess[ApiAccess["WITH_TOKEN"] = 4] = "WITH_TOKEN";
})(ApiAccess = exports.ApiAccess || (exports.ApiAccess = {}));
const createApiMiddlware = api => (req, res, next) => {
    console.log(`Query:`, req.query);
    const apiHttpMethod = api[req.method.toLocaleLowerCase()];
    if (!apiHttpMethod)
        return res.status(400).send({ msg: `http method ${req.method} unsupported` });
    const method = apiHttpMethod[req.params.method];
    if (!method)
        return res.status(400).send({ msg: "invalid api method" });
    if (method.access & ApiAccess.WITH_TOKEN) {
        auth_1.default(req, res, () => __awaiter(this, void 0, void 0, function* () {
            executeMethod(method, req.query, res)
                .then(() => next())
                .catch(console.log);
        }));
    }
    else {
        executeMethod(method, req.query, res)
            .then(() => next())
            .catch(console.log);
    }
};
exports.default = createApiMiddlware;
// (req: Request, res: Response, next: NextFunction) => {
//   console.log(`Query:`, req.query);
//   const apiHttpMethod = api[req.method.toLocaleLowerCase()];
//   if (!apiHttpMethod) return res.status(400).send({ msg: `http method ${req.method} unsupported` });
//   const method = apiHttpMethod[req.params.method];
//   if (!method) return res.status(400).send({ msg: "invalid api method" });
//   if (method.access & ApiAccess.WITH_TOKEN)
//     auth(req, res, async () => {
//       executeMethod(method.execute, req.query, res)
//         .then(() => next())
//         .catch(console.log);
//     });
//   else
//     executeMethod(method.execute, req.query, res)
//       .then(next)
//       .catch(console.log);
// };
