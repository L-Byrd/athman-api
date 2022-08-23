import express from "express";
import path, {join, dirname} from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import router from "./routes/routes";
import morganMiddleWare from "./middleware/morgan";

if(process.env.NODE_ENV !== "production") dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//use helmet to secure http response headers
app.use(helmet());
app.use(cors({ origin: true }));

if(process.env.NODE_ENV == "production"){
    app.use(compression());
    app.use(express.static(join(__dirname, "src/build")));

    app.get("*", function (req, res) {
      res.sendFile(join(__dirname, "src/build", "index.html"));
    });
}

app.use(morganMiddleWare);
app.use(router);

app.get("/service-worker.js", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "build", "service-worker.js"));
  });

app.listen(port, () => {
    console.log('Server listening on port ' + port);
});