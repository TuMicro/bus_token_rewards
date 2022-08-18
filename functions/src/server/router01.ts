import * as express from "express";
import { getFirebaseAuthMiddleware } from "./util/express-firebase-middleware";
import { logRequest } from "./util/log-request-middleware";
import { logAndAnswer } from "./util/utils";

export const routerV1 = express
  .Router()

  // declaring auth protected prefix
  .use("/p/", getFirebaseAuthMiddleware(false))
  // declaring auth protected prefix but where authentication is optional
  .use("/po/", getFirebaseAuthMiddleware(true))

  // log request path and body
  .use(logRequest)


  // endpoints code:
;

