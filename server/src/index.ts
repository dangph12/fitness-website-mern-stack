import dotenv from 'dotenv';

import app from './app';
dotenv.config();

const { SERVER_URL } = process.env;

const onError = (error: NodeJS.ErrnoException): void => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      console.error(`${SERVER_URL} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${SERVER_URL} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const url = new URL(SERVER_URL ?? 'http://localhost:8000');
const port = Number(url.port) || 8000;

const server = app.listen(port, () => {
  console.log(`Server is Fire at ${SERVER_URL}`);
});

server.on('error', onError);
