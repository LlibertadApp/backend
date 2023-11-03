import {
  APIGatewayRequestAuthorizerEventV2,
  Callback,
  Context,
} from "aws-lambda";
import jwt from "jsonwebtoken";
import {
  FirebasePublicKeysType,
  fetchFirebasePublicKeys,
} from "@/helpers/auth/fetch-firebase-public-keys";
import { authorizerErrors } from "@/helpers/configs/errorConstants";
import { generateAuthorizeOutput } from "@/helpers/auth/generate-autorize-output";

let cachedKeys: FirebasePublicKeysType | null = null;
let lastFetchTime: number | null = null;

const unauthorizedPrincipalId = "unauthorized-user";

export const handler = async (
  event: APIGatewayRequestAuthorizerEventV2,
  _context: Context,
  callback: Callback
): Promise<void> => {
  const routeArn = event.routeArn;
  try {
    if (!event.headers) {
      console.error(authorizerErrors.NO_HEADERS_PRESENT);
      callback(
        null,
        generateAuthorizeOutput(unauthorizedPrincipalId, "Deny", routeArn)
      );
      return;
    }

    const token = event.headers["Authorization"];

    if (!token) {
      console.error(authorizerErrors.UNDEFINED_AUTHORIZATION_HEADER);
      callback(
        null,
        generateAuthorizeOutput(unauthorizedPrincipalId, "Deny", routeArn)
      );
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
          console.error(authorizerErrors.FIREBASE_AUTH_VERIFICATION_ERROR, err);
          callback(
            null,
            generateAuthorizeOutput(unauthorizedPrincipalId, "Deny", routeArn)
          );
        } else {
          if (payload) {
            const principalId = payload.sub;
            if (!principalId) {
              console.error(authorizerErrors.UNDEFINED_PRINCIPAL_ID);
              callback(
                null,
                generateAuthorizeOutput(
                  unauthorizedPrincipalId,
                  "Deny",
                  routeArn
                )
              );
            } else {
              callback(
                null,
                generateAuthorizeOutput(principalId, "Allow", routeArn)
              );
            }
          } else {
            console.error(authorizerErrors.UNDEFINED_FIREBASE_AUTH_PAYLOAD);
            callback(
              null,
              generateAuthorizeOutput(unauthorizedPrincipalId, "Deny", routeArn)
            );
          }
        }
      }
    );
  } catch (error) {
    console.error(authorizerErrors.UNEXPECTED_AUTHORIZE_ERROR, error);
    callback(
      null,
      generateAuthorizeOutput(unauthorizedPrincipalId, "Deny", routeArn)
    );
  }
};
