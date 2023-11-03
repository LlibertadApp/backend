import axios from "axios";
import { httpErrors } from "../configs/errorConstants";

export async function fetchFirebasePublicKeys(
  cachedKeys: { [key: string]: string } | null = null,
  lastFetchTime: number | null = null
): Promise<{ [key: string]: string }> {
  const firebasePublicKeyUrl = process.env.FIREBASE_PUBLIC_KEYS_URL;
  
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