import express from 'express';
import cors from 'cors';
import Router from './routes/api-router';

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", Router);

// Test endpoint. OK to delete
app.get('/', (req, res, next) => {
  console.log("GET / Endpoint OK!");

  res.status(200).send();
});

export default app;
