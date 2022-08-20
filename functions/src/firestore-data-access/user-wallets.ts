import { FS_polygon_wallets } from "../constants/firestore";
import { fdb } from "../firestore-init";

interface UserWallet {
  wallet: string;
}

// get the wallet for a userId
export async function getWallet(userId: string) {
  const doc = await fdb.collection(FS_polygon_wallets).doc(userId).get();
  return doc.data() as UserWallet | undefined;
}