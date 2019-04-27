import { Request, Response, NextFunction, RequestHandler } from "express";
import auth from "./auth";
import * as joi from "joi";

export interface IAPIMethod {
  schema?: joi.SchemaLike;
  access: ApiAccess;
  execute: (query: any) => Promise<any>;
}

export function apiError(code: number, msg: string) {
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

function executeMethod(method: IAPIMethod, query: any, res: Response): Promise<void> {
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

export enum ApiAccess {
  GUEST,
  WITH_TOKEN = 1 << 2
}

const createApiMiddlware: (api: IAPI) => RequestHandler = api => (req: Request, res: Response, next: NextFunction) => {
  console.log(`Query:`, req.query);
  const apiHttpMethod = api[req.method.toLocaleLowerCase()];
  if (!apiHttpMethod) return res.status(400).send({ msg: `http method ${req.method} unsupported` });
  const method = apiHttpMethod[req.params.method];
  if (!method) return res.status(400).send({ msg: "invalid api method" });
  if (method.access & ApiAccess.WITH_TOKEN) {
    auth(req, res, async () => {
      executeMethod(method, req.query, res)
        .then(() => next())
        .catch(console.log);
    });
  } else {
    executeMethod(method, req.query, res)
      .then(() => next())
      .catch(console.log);
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
