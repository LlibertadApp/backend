import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import jwt from "jsonwebtoken";
import { generatePolicyDocument } from "@/helpers/auth/policy-document";
import { fetchFirebasePublicKeys } from "@/helpers/auth/fetch-firebase-public-keys";

let cachedKeys: { [key: string]: string } | null = null;
let lastFetchTime: number | null = null;

export const handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback
): Promise<void> => {
  try {
    const token = event.headers["Authorization"];

    if (!token) {
      console.error('Authorization header is Undefined');
      callback(null, {
        principalId: "unauthorized-user",
        policyDocument: generatePolicyDocument("Deny", "*"),
      });
      return;
    }

    const publicKeys = await fetchFirebasePublicKeys(cachedKeys, lastFetchTime);

    const header64 = token.split(".")[0];
    const header = JSON.parse(
      Buffer.from(header64, "base64").toString("ascii")
    );

    jwt.verify(
      token,
      publicKeys[header.kid],
      { algorithms: ["RS256"] },
      function (err, payload) {
        if (err) {
          console.error('Firebase Auth Token Verify Error: ', err);
          callback(null, {
            principalId: "unauthorized-user",
            policyDocument: generatePolicyDocument("Deny", "*"),
          });
        } else {
          if (payload) {
            const principalId = payload.sub;
            const policyDocument = generatePolicyDocument("Allow", "*");

            callback(null, {
              principalId,
              policyDocument,
            });
          } else {
            console.error('Firebase Auth Payload is Undefined');
            callback(null, {
              principalId: "unauthorized-user",
              policyDocument: generatePolicyDocument("Allow", "*"),
            });
          }
        }
      }
    );
  } catch (error) {
    console.error('Authorizer Error: ', error);
    callback(null, {
      principalId: "unauthorized-user",
      policyDocument: generatePolicyDocument("Allow", "*"),
    });
  }
};
