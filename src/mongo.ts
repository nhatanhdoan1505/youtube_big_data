import { ConnectOptions } from "mongoose";
import mongoose = require("mongoose");

type ConnectionOptionsExtend = {
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
};

const options: ConnectOptions & ConnectionOptionsExtend = {
  useNewUrlParser: true,
  useUnifiedTopology: false,
  user: "admin",
  pass: "123456",
  dbName: "youtubedata1",
};

export const connectMongo = async () => {
  mongoose
    .connect("mongodb://admin:123456@mongodb:27017", options)
    .then(() => {
      console.log("Connect DB");
    })
    .catch((err) => console.log({ err }));
};
//207.148.78.192:root:[v5G$oVK=S(Svs45
