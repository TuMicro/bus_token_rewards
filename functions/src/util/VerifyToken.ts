import { fApp } from "../firebase-init";
import { getAuth } from 'firebase-admin/auth';

// idToken comes from the client app
export async function verifyIdToken(idToken: string): Promise<string | null> {
  try {
    const decodedToken = await getAuth(fApp).verifyIdToken(idToken);

    /**
     * 
     * Example of decodedToken:
    iss: "https://securetoken.google.com/tumicro-1203"
    picture: "https://lh5.googleusercontent.com/-_7UDFVjp7Zo/AAAAAAAAAAI/AAAAAAAAAAA/AAomvV0XUQO6lhsAQArLRA_4LftyFHpMXA/s96-c/photo.jpg"
    aud: "tumicro-1203"
    auth_time: 1539892550
    user_id: "RMD3I7kABxNbUpTx40adIb1YQwI3"
    sub: "RMD3I7kABxNbUpTx40adIb1YQwI3"
    iat: 1539975411
    exp: 1539979011
    email: "lolitopeluchero@gmail.com"
    email_verified: true
    firebase: {
    "identities": {
        "google.com": [
        "103790285200735275985"
        ],
        "facebook.com": [
        "100636407145019"
        ],
        "email": [
        "lolitopeluchero@gmail.com"
        ]
    },
    "sign_in_provider": "google.com"
    }
    uid: "RMD3I7kABxNbUpTx40adIb1YQwI3"
     */
    return decodedToken.uid;
  } catch (e) {
    console.log("token verification failed");
    // console.log(e); // uncommented to prevent triggering log alarms
    return null;
  }
}
