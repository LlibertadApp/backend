import axios from "axios";
import { infraestructureErrors } from "../configs/errorConstants";

export type FirebasePublicKeysType = { [key: string]: string }

export async function fetchFirebasePublicKeys(
  cachedKeys: FirebasePublicKeysType | null = null,
  lastFetchTime: number | null = null
): Promise<FirebasePublicKeysType> {
  const firebasePublicKeyUrl = process.env.FIREBASE_PUBLIC_KEYS_URL;
  
  if (!firebasePublicKeyUrl) {
    throw new Error(
      infraestructureErrors.ENVIRONMENT_VARIABLE_NOT_FOUND("FIREBASE_PUBLIC_KEYS_URL")
    );
  }

  if (
    cachedKeys &&
    lastFetchTime &&
    Date.now() - lastFetchTime < 24 * 60 * 60 * 1000
  ) {
    return cachedKeys;
  }

  const response = await axios.get<FirebasePublicKeysType>(firebasePublicKeyUrl);
  cachedKeys = response.data;
  lastFetchTime = Date.now();

  return cachedKeys;
}