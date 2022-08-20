import { init } from './init/init';
init(); // Executed synchronously before the rest of your app loads

import * as functions from 'firebase-functions';
import { endpoints } from './app';
import fetch from "node-fetch";
import { sleep } from './util/GeneralUtils';

export const cf_endpoints_2nd_gen = endpoints;

export const bus_token_rewards = functions.pubsub.schedule('0 23 * * *') // This will be run every day at 11:00 pm GMT-5!
  .timeZone('America/Lima').onRun(async function (context) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetch(`https://deliver-bus-token-rewards-ftudvoxlaq-uc.a.run.app/deliverBusTokenRewards`, {
      method: 'GET',
    });
    await sleep(2 * 1000); // just to make sure we pinged the endpoint
  });
