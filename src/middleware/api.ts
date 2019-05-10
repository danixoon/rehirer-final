import { Request, Response, NextFunction, RequestHandler } from "express";
import auth from "./auth";
import * as joi from "joi";

import * as colors from "colors/safe";

export interface IAPIMethod {
  schema?: joi.SchemaLike;
  access: ApiAccess;
  execute: (query: any, req: any) => Promise<any>;
}

export function apiError(msg: string, code?: number) {
  return {
    code,
    msg
  };
}

export interface IAPI {
  [httpMethod: string]: {
    [apiMethod: string]: IAPIMethod;
  };
}

function executeMethod(method: IAPIMethod, query: any, res: Response, req: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    if (method.schema) {
      const result = joi.validate(query, joi.object().keys(method.schema as any), { allowUnknown: true, convert: true });
      if (result.error) {
        const err = { code: 400, msg: result.error.details[0].message };
        return reject(err);
      }
      query = result.value;
    }
    return method
      .execute(query, req)
      .then(resolve)
      .catch(reject);
  });
}

export enum ApiAccess {
  GUEST,
  TOKEN = 1 << 2
}

function sendError(res: Response, err: { code?: number; msg?: string }) {
  return res.status(err.code || 500).send({ msg: err.msg || "error" });
}

const createApiMiddlware: (api: IAPI) => RequestHandler = api => async (req: Request, res: Response, next: NextFunction) => {
  const methodName = `${req.method} ${req.baseUrl + req.path}`;
  console.log(`${colors.yellow("API_QUERY")} --- ${methodName}\n`, req.query, "\n");
  const apiHttpMethod = api[req.method.toLocaleLowerCase()];
  if (!apiHttpMethod) return res.status(400).send({ msg: `http method ${req.method} unsupported` });
  const method = apiHttpMethod[req.params.method];
  if (!method) return res.status(400).send({ msg: "invalid api method" });
  try {
    let id;
    if (method.access & ApiAccess.TOKEN) {
      id = await new Promise((resolve, reject) =>
        auth(req.header("x-auth-token"), (err, id) => {
          if (err) return reject(err);
          return resolve(id);
        })
      );
    }
    const data = await executeMethod(method, { ...req.query, id }, res, req);
    res.status(200).send(data);
    console.log(`${colors.green("API_SUCCESS")} --- ${methodName}\n`, data, "\n");
    next();
  } catch (err) {
    sendError(res, err);
    console.log(`${colors.red("API_ERROR")} --- ${methodName}\n`, err, "\n");
  }
};

export default createApiMiddlware;

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
