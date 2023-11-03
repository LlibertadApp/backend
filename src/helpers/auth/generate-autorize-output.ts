import { APIGatewayAuthorizerResult, PolicyDocument } from "aws-lambda";
import { EffectType, generatePolicyDocument } from "./policy-document";

export const unauthorizedPrincipalId = "unauthorized-user";

export function generateAuthorizeOutput(
  principalId: string,
  effect: EffectType,
  routeArn: string
): APIGatewayAuthorizerResult {
  return {
    principalId,
    policyDocument: generatePolicyDocument(effect, routeArn),
  };
}
