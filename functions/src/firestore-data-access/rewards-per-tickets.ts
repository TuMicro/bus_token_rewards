import { FS_polygon_ads } from "../constants/firestore";
import { fdb } from "../firestore-init";


export interface RewardPerTicket {
  // timestamp: ; // not needed
  userId: string;
  timestamp_entrega: number | null; // millis
  wallet?: string;
}

export interface RewardPerTicketWithId extends RewardPerTicket {
  id: string;
}

// get the reward doc for a userId
export async function getRewardDocument(tripId: string) {
  const doc = await fdb.collection(FS_polygon_ads).doc(tripId).get();
  return doc.data() as RewardPerTicket | undefined;
}

// get reward documents where timestamp_entrega is null
export async function getRewardsNotDeliveredYet() {
  const query = await fdb.collection(FS_polygon_ads)
    .where("timestamp_entrega", "==", null)
    .get();
  return query.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as RewardPerTicket),
  }));
}

