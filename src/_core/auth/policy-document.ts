import { PolicyDocument } from "aws-lambda";

export enum PolicyEffect {
  Allow = "Allow",
  Deny = "Deny",
}

export type EffectType = PolicyEffect.Allow | PolicyEffect.Deny

export function generatePolicyDocument(effect: EffectType, resource: string): PolicyDocument {
  return {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: resource,
      },
    ],
  };
}