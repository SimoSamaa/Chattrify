declare module 'trim-request' {
  import { RequestHandler } from 'express';

  const trimRequest: {
    body: RequestHandler;
    query: RequestHandler;
    params: RequestHandler;
    all: RequestHandler;
  };

  export default trimRequest;
}
