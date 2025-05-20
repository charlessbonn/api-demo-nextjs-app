export interface CONFIGMODEL {
    devMode?: boolean;
    uriS1?: string;
    jwtSecret?: string;
    emailUser?: string;
    emailPass?: string;
    devWebUrl?: string;
    prodWebUrl?: string;
    dbName?: string;
    colNameProducts?: string;
    colNameAdmin?: string;
    colNamePayments?: string;
    r2Bucket?: string;
    r2Endpoint?: string;
    r2AccessKey?: string;
    r2SecretKey?: string;
    googleClientId?: string;
    xenditSecretKey?: string;
}

const devConfig: CONFIGMODEL = {
    devMode: (process.env.DEV_MODE ?? "true") == "true",
    uriS1: process.env.MONGODB_URI_S1,
    jwtSecret: process.env.JWT_SECRET,
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
    devWebUrl: process.env.DEV_WEB_URL,
    prodWebUrl: process.env.PROD_WEB_URL,
    dbName: process.env.DB_NAME,
    colNameProducts: process.env.COL_PRODUCTS,
    colNameAdmin: process.env.COL_ADMIN,
    colNamePayments: process.env.COL_PAYMENTS,
    r2Bucket: process.env.R2_BUCKET,
    r2Endpoint: process.env.R2_ENDPOINT,
    r2AccessKey: process.env.R2_ACCESS_KEY,
    r2SecretKey: process.env.R2_SECRET_KEY,
    googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    xenditSecretKey: process.env.SECRET_API_KEY,
}

const prodConfig: CONFIGMODEL = {
    devMode: (process.env.DEV_MODE ?? "true") == "true",
    uriS1: process.env.PROD_MONGODB_URI_S1,
    jwtSecret: process.env.JWT_SECRET,
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
    devWebUrl: process.env.DEV_WEB_URL,
    prodWebUrl: process.env.PROD_WEB_URL,
    dbName: process.env.DB_NAME,
    colNameProducts: process.env.COL_PRODUCTS,
    colNameAdmin: process.env.COL_ADMIN,
    colNamePayments: process.env.COL_PAYMENTS,
    r2Bucket: process.env.R2_BUCKET,
    r2Endpoint: process.env.R2_ENDPOINT,
    r2AccessKey: process.env.R2_ACCESS_KEY,
    r2SecretKey: process.env.R2_SECRET_KEY,
    googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    xenditSecretKey: process.env.SECRET_API_KEY,
}

export const MyConfig = (process.env.DEV_MODE ?? "true") == "true"
    ? devConfig
    : prodConfig;