import express from 'express';
import middleware from "./middleware/index.js";
import path from 'path';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({ exposedHeaders: ["links"] }))

app.use(express.static('src/static'));

app.use(middleware());

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
