import crypto from "crypto";

class Utils {
 static getRandomImageName = (bytes = 16) => {
  return crypto.randomBytes(bytes).toString("hex");
 };
}

export default Utils;
