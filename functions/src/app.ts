import express from "express";
import cors from "cors";
import { isTesting } from "./util/devEnv";
import { routerV1 } from "./server/router01";
import { deliver_token_rewards } from "./tasks/deliver-token-rewards";

const app = express();

// common endpoints:

app.use(cors()); // allowing all origins for now

app.get("/isTestingEnv", async function (req, res) {
  const i = isTesting();
  console.log("isTesting: ", i);
  res.json({
    status: 'OK',
    isTesting: i,
  });
});

app.get("/crashNotificationTester", async function (req, res) {
  throw new Error('crashNotificationTester');
});

app.get("/deliverBusTokenRewards", async function (req, res) {
  await deliver_token_rewards();
  res.json({
    status: 'OK',
  });
});

// dummy endpoint that just returns OK:
app.get("/", async function (req, res) {
  console.log(JSON.stringify(req.query));
  res.json({
    status: 'OK'
  });
});

app.use("/api/v1", routerV1);

export const endpoints = app;