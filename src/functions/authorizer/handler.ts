import {
  APIGatewayRequestAuthorizerEventV2,
  APIGatewayAuthorizerResult,
  Context,
} from "aws-lambda";
import { primitives } from "@/_core/configs/common";
import { FirebasePublicKeysType, fetchFirebasePublicKeys } from "@/_core/auth/fetch-firebase-public-keys";
import { authorizerErrors } from "@/_core/configs/errorConstants";
import { generateAuthorizeOutput, unauthorizedPrincipalId } from "@/_core/auth/generate-autorize-output";
import { PolicyEffect } from "@/_core/auth/policy-document";
import { verifyFirebaseIdToken } from "@/_core/auth/verify-firebase-id-token";

let cachedKeys: FirebasePublicKeysType | null = null;
let lastFetchTime: number | null = null;

export const handler = async (
  event: APIGatewayRequestAuthorizerEventV2,
  _context: Context
): Promise<APIGatewayAuthorizerResult> => {
  const routeArn = event.routeArn;
  try {
    if (!event.headers) {
      console.error(authorizerErrors.NO_HEADERS_PRESENT);
      return generateAuthorizeOutput(
        unauthorizedPrincipalId,
        PolicyEffect.Deny,
        routeArn
      );
    }

    const token = event.headers[primitives.Authorization];

    if (!token) {
      console.error(authorizerErrors.UNDEFINED_AUTHORIZATION_HEADER);
      return generateAuthorizeOutput(
        unauthorizedPrincipalId,
        PolicyEffect.Deny,
        routeArn
      );
    }

    const publicKeys = await fetchFirebasePublicKeys(cachedKeys, lastFetchTime);
    const header64 = token.split(primitives.splitDot)[0];
    const header = JSON.parse(
      Buffer.from(header64, primitives.base64).toString(primitives.ascii)
    );

    const verifyIdTokenResult = await verifyFirebaseIdToken(
      token,
      publicKeys,
      header
    );

    if (verifyIdTokenResult) {
      const principalId = verifyIdTokenResult.sub as string;
      if (!principalId) {
        console.error(authorizerErrors.UNDEFINED_PRINCIPAL_ID);
        return generateAuthorizeOutput(
          unauthorizedPrincipalId,
          PolicyEffect.Deny,
          routeArn
        );
      } else {
        return generateAuthorizeOutput(
          principalId,
          PolicyEffect.Allow,
          routeArn
        );
      }
    } else {
      console.error(authorizerErrors.UNDEFINED_FIREBASE_AUTH_PAYLOAD);
      return generateAuthorizeOutput(
        unauthorizedPrincipalId,
        PolicyEffect.Deny,
        routeArn
      );
    }
  } catch (error) {
    console.error(authorizerErrors.UNEXPECTED_AUTHORIZE_ERROR, error);
    return generateAuthorizeOutput(
      unauthorizedPrincipalId,
      PolicyEffect.Deny,
      routeArn
    );
  }
};
