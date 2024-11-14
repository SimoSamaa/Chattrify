import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;
const routerFiles = fs.readdirSync(path.join(__dirname, 'routers'));

app.use(express.json());

app.use((_: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', `http://localhost:${PORT}`);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

routerFiles.forEach((file) => {
  try {
    app.use('/', require(`./routers/${file}`).default);
  } catch (error) {
    if (!(error instanceof Error)) return;
    console.log(`Error loading router files: ${error.message}`);
  }
});

mongoose.connect(process.env.MONGO_DB as string)
  .then(() => {
    app.listen(PORT, () => {
      process.stdout
        .write(`Server Chattrify is running in -> \x1b[34mhttp://localhost:${PORT}\x1b[0m\n`);
      console.log('router files:', routerFiles);
    });
  })
  .catch((err: Error) => {
    console.log(`Chattrify error server: ${err}`);
  });
