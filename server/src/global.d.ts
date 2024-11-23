declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    MONGO_DB: string;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
  }
}