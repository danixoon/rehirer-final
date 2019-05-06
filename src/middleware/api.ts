import { Request, Response, NextFunction, RequestHandler } from "express";
import auth from "./auth";
import * as joi from "joi";

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
        res.status(400).send({ msg: result.error.details[0].message });
        return reject(result.error);
      }
      query = result.value;
    }
    method
      .execute(query, req)
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
  TOKEN = 1 << 2
}

const createApiMiddlware: (api: IAPI) => RequestHandler = api => (req: Request, res: Response, next: NextFunction) => {
  console.log(`Query:`, req.query);
  const apiHttpMethod = api[req.method.toLocaleLowerCase()];
  if (!apiHttpMethod) return res.status(400).send({ msg: `http method ${req.method} unsupported` });
  const method = apiHttpMethod[req.params.method];
  if (!method) return res.status(400).send({ msg: "invalid api method" });
  if (method.access & ApiAccess.TOKEN) {
    auth(req.header("x-auth-token"), async (err, id) => {
      if (err) return res.status(err.code || 500).send({ msg: err.msg || "error" });
      executeMethod(method, { ...req.query, id }, res, req).then(() => next());
    });
  } else {
    executeMethod(method, req.query, res, req)
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
