import morgan from "morgan";
import logger from "../logging/logger";

const morganMiddleWare = morgan("combined", {
  //skip requests without errors
  skip: (req, res) => res.statusCode < 400,
  //stream for logging requests
  stream: {
    write: (msg) => logger.http(msg),
  },
});

export default morganMiddleWare;