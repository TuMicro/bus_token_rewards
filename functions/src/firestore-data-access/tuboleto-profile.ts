import { FS_profile } from "../constants/firestore";
import { fdb } from "../firestore-init";

interface UserProfile {
  correo?: string | null;
}

export async function getUserProfile(userId: string) {
  const doc = await fdb.collection(FS_profile).doc(userId).get();
  return doc.data() as UserProfile | undefined;
}