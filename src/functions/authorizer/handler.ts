import axios from "axios";
import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import jwt from "jsonwebtoken";
import { httpErrors } from "@/helpers/configs/errorConstants";
import EnumEnv from "@/helpers/enum/environments";

const firebasePublicKeyUrl = process.env.FIREBASE_PUBLIC_KEYS_URL;

let cachedKeys: { [key: string]: string } | null = null;
let lastFetchTime: number | null = null;

async function fetchFirebasePublicKeys(): Promise<{ [key: string]: string }> {
  if (!firebasePublicKeyUrl) {
    throw new Error(
      httpErrors.ENVIRONMENT_VARIABLE_NOT_FOUND("FIREBASE_PUBLIC_KEYS_URL")
    );
  }

  if (
    cachedKeys &&
    lastFetchTime &&
    Date.now() - lastFetchTime < 24 * 60 * 60 * 1000
  ) {
    return cachedKeys as { [key: string]: string };
  }

  const response = await axios.get(firebasePublicKeyUrl);
  cachedKeys = response.data;
  lastFetchTime = Date.now();

  return cachedKeys as { [key: string]: string };
}

export const handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback
): Promise<void> => {
  try {
    const environment = process.env.ALBERTAPP_ENV;

    if (environment === EnumEnv.LOCAL) {
      const policyDocument = {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: "*",
          },
        ],
      };

      callback(null, {
        principalId: "local-user",
        policyDocument,
      });
      return;
    }

    const token = event.headers["Authorization"];

    if (!token) {
      callback(null, {
        principalId: "unauthorized-user", // or some other placeholder
        policyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Action: "execute-api:Invoke",
              Effect: "Deny", // Notice we deny the access
              Resource: "*",
            },
          ],
        },
      });
      return;
    }

    const publicKeys = await fetchFirebasePublicKeys();

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
          callback(null, {
            principalId: "unauthorized-user", // or some other placeholder
            policyDocument: {
              Version: "2012-10-17",
              Statement: [
                {
                  Action: "execute-api:Invoke",
                  Effect: "Deny", // Notice we deny the access
                  Resource: "*",
                },
              ],
            },
          });
        } else {
          if (payload) {
            const principalId = payload.sub;
            const policyDocument = {
              Version: "2012-10-17",
              Statement: [
                {
                  Action: "execute-api:Invoke",
                  Effect: "Allow",
                  Resource: "*",
                },
              ],
            };

            callback(null, {
              principalId,
              policyDocument,
            });
          } else {
            callback(null, {
              principalId: "unauthorized-user", // or some other placeholder
              policyDocument: {
                Version: "2012-10-17",
                Statement: [
                  {
                    Action: "execute-api:Invoke",
                    Effect: "Deny", // Notice we deny the access
                    Resource: "*",
                  },
                ],
              },
            });
          }
        }
      }
    );
  } catch (error) {
    callback(null, {
      principalId: "unauthorized-user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: "*",
          },
        ],
      },
    });
  }
};
