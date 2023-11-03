import { PolicyDocument } from "aws-lambda";
import { EffectType, generatePolicyDocument } from "./policy-document";

export type AuthorizeOutputType = {
  principalId: string | (() => string);
  policyDocument: PolicyDocument;
};

export function generateAuthorizeOutput(
  principalId: string | (() => string),
  effect: EffectType,
  routeArn: string
): AuthorizeOutputType {
  return {
    principalId: principalId,
    policyDocument: generatePolicyDocument(effect, routeArn),
  };
}
