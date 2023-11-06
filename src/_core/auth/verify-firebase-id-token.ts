import jwt from "jsonwebtoken";
import { FirebasePublicKeysType } from "./fetch-firebase-public-keys";

export type FirebaseIdTokenType = {
  alg: string;
  kid: string;
  typ: string;
};

export async function verifyFirebaseIdToken(
  token: string,
  publicKeys: FirebasePublicKeysType,
  header: FirebaseIdTokenType
) {
  return await new Promise<string | jwt.JwtPayload | undefined>(
    (resolve, reject) => {
      jwt.verify(
        token,
        publicKeys[header.kid],
        { algorithms: ["RS256"] },
        (err, decoded) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded);
          }
        }
      );
    }
  );
}
