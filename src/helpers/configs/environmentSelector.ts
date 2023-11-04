import EnumEnv from "../enum/environments";

export const EnvironmentSelector = (): string => {
    console.log(`Entorno - ${process.env.LBERTAPP_ENV}`);
    let envFilePath;
    switch (process.env.LBERTAPP_ENV) {
        case EnumEnv.LOCAL:
            envFilePath = '.env.local';
            break;
        case EnumEnv.DEV:
            envFilePath = '.env.dev';
            break;
        case EnumEnv.PRODUCTION:
            envFilePath = '.env';
            break;
        default:
            envFilePath = '.env';
            break;
    }
    console.log(`envFilePath - ${envFilePath}`);
    return envFilePath;
}