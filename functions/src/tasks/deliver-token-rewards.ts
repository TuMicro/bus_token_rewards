import { BigNumber, constants } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { FS_polygon_ads } from "../constants/firestore";
import { getRewardsNotDeliveredYet, RewardPerTicket, RewardPerTicketWithId } from "../firestore-data-access/rewards-per-tickets";
import { getUserProfile } from "../firestore-data-access/tuboleto-profile";
import { getWallet } from "../firestore-data-access/user-wallets";
import { fdb } from "../firestore-init";
import { mailSender } from "../util/email";
import { mint_tokens } from "./mint-tokens";

const REWARD_AMOUNT_IN_TOKENS = 100;

export const FUNCTION_TIMEOUT_SECONDS = 3600; // set in the cloud function (on index.ts or on the deploy command)

export async function deliver_token_rewards() {
  const start_time = Date.now();

  const toReward = await getRewardsNotDeliveredYet();

  // group rewards by userId
  const groupedRewards = toReward.reduce((acc, reward) => {
    const userId = reward.userId;
    if (!acc[userId]) {
      acc[userId] = [];
    }
    acc[userId].push(reward);
    return acc;
  }, {} as { [userId: string]: RewardPerTicketWithId[] });


  // reward each user
  for (const userId of Object.keys(groupedRewards)) {
    // if the remainding time is not enough for one more chunk then we stop
    const transpired_time = Date.now() - start_time;
    const remainding_time = FUNCTION_TIMEOUT_SECONDS * 1000 - transpired_time;
    const issue_chunk_time_limit_ms = 30 * 60 * 1000;
    if (issue_chunk_time_limit_ms >= remainding_time) {
      console.log(`time limit reached, stopping token issuance task to avoid having half executed code`);
      return;
    }


    const rewards = groupedRewards[userId];

    const wd = await getWallet(userId);

    if (wd == null) {
      console.log(`No wallet found for user ${userId}`);
      continue;
    }



    const r = await issue_chunk_of_tokens_for_user_id(rewards, userId, wd.wallet);

    if (r != null) {
      const profile = await getUserProfile(userId);
      const email = profile?.correo ?? "";
      if (email === "") {
        console.log(`No email found for user ${userId}`);
      } else {
        console.log(`Emailing ${email}`);
        await mailSender({
          to: email,
          from: 'hola@turuta.pe', // Use the email address or domain you verified above
          subject: 'Recibiste tus BUS tokens 😊',
          text: r.transaction_id === "" ?
            `Hola! Hubo un error al enviarte tus tokens, comunícate con nosotros para que te ayudemos.` :
            `Hola! Has recibido ${formatEther(r.base_units)} BUS tokens por tus viajes en tu wallet ${wd.wallet}. `
            + `El id de transacción es ${r.transaction_id}.`,
        });
      }
    }
  }
}

async function issue_chunk_of_tokens_for_user_id(chunk: RewardPerTicketWithId[],
  userId: string,
  walletAddress: string) {

  console.log(`issuing tokens for user ${userId} with address ${walletAddress}`);

  const docRefs = chunk.map(doc => fdb.collection(FS_polygon_ads).doc(doc.id));

  const TOKENS_ALREADY_ISSUED = "FOUND_DOC_WITH_TOKENS_ALREADY_ISSUED";
  const TOKEN_AMOUNT_IS_ZERO = "TOKEN_AMOUNT_IS_ZERO";

  try {

    const res = await fdb.runTransaction(async t => {
      const docs = await Promise.all(docRefs.map(docRef =>
        t.get(docRef)));

      let n_tokens = BigNumber.from(0);
      for (const doc of docs) {
        const docData = doc.data() as RewardPerTicketWithId;
        if (docData.timestamp_entrega !== null) {
          throw TOKENS_ALREADY_ISSUED;
        }
        n_tokens = n_tokens.add(constants.WeiPerEther.mul(REWARD_AMOUNT_IN_TOKENS));
      }

      const base_units = n_tokens; // an integer

      if (base_units.isZero()) {
        throw TOKEN_AMOUNT_IS_ZERO;
      }

      // storing the result:
      const now = Date.now();
      for (const docRef of docRefs) {
        const updObj: Partial<RewardPerTicket> = {
          timestamp_entrega: now,
          wallet: walletAddress,
        };
        t.update(docRef, updObj);
      }

      return {
        base_units,
      };
    }, {
      maxAttempts: 2, // contention retries time,
      // we set 2 because this process is retried periodically anyway
    });

    // Issuing tokens: sign transaction
    // and send it to the blockchain.
    // We do this outside the transaction
    // to avoid issuing excess tokens
    // on the remote case of multiple processes
    // calling this function in parallel with the same inputs.
    // We retry to prevent having to run correction
    // scripts in the future.
    let n_retries = 2;
    let txId = "";
    while (n_retries > 0) {
      n_retries--;
      try {
        txId = await mint_tokens(
          res.base_units,
          walletAddress);
        break;
      } catch (e) {
        console.error(e);
        console.log(`error issuing tokens for user ${userId} with address ${walletAddress}, attempt N ${n_retries}`);
      }
    }
    // storing the transaction id in Firestore for later analysis
    await Promise.all(docRefs.map(docRef => docRef.update({
      transaction_id: txId,
    })));

    console.log(JSON.stringify({
      "type": "issuance",
      transaction_id: txId,
      base_units: res.base_units,
      walletAddress,
      userId,
    }));

    return {
      transaction_id: txId,
      base_units: res.base_units,
      walletAddress,
      userId,
    };

  } catch (e) {
    if (e === TOKENS_ALREADY_ISSUED) {
      console.log(JSON.stringify({
        "type": "issuance",
        "error": "tokens_already_issued",
        walletAddress,
        userId,
        message: "not severe",
      }));
    } else if (e === TOKEN_AMOUNT_IS_ZERO) {
      console.log(JSON.stringify({
        "type": "issuance",
        "error": "token_amount_is_zero",
        walletAddress,
        userId,
        message: "not severe",
      }));
    } else {
      console.log(JSON.stringify({
        "type": "issuance",
        "error": "other",
        walletAddress,
        userId
      }));
      console.error(e);
    }
  }
  return null;
}
