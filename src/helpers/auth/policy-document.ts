import { PolicyDocument } from "aws-lambda";

export type EffectType = "Allow" | "Deny"

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