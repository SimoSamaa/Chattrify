declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    CLIENT_URL: string;
    MONGO_DB: string;
    DEV_MODE: string;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    VERIFICATION_TOKEN_SECRET: string;
  }
}