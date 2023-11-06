import EnumEnv from "@/helpers/enum/environments";
import { initializeAdminDev } from "./firebase-admin-dev-";
import { initializeApp } from "./firebase-admin-prod";

export const initializeFirebaseAdminApp = async (): Promise<any> => {
  switch (process.env.LBERTAPP_ENV) {
    case EnumEnv.LOCAL:
      return await initializeAdminDev();
    case EnumEnv.DEV:
      return await initializeAdminDev();
    case EnumEnv.PRODUCTION:
      return await initializeApp();
    default:
      return await initializeAdminDev();
  }
};
