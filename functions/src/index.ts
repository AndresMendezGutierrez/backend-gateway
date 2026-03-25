import axios from "axios";
import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/https";

setGlobalOptions({ maxInstances: 10 });

export const validateRecaptcha = onRequest(
  {
    cors: ["http://localhost:4321"],
    secrets: ["RECAPTCHA_SECRET_KEY"],
  },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const { token } = req.body;

    if (!token) {
      res.status(400).json({ isValid: false, message: "Token is required" });
      return;
    }

    try {
      const secretKey = process.env.RECAPTCHA_SECRET_KEY;
      const verifyUrl = "https://www.google.com/recaptcha/api/siteverify";

      const response = await axios.post(verifyUrl, null, {
        params: {
          secret: secretKey,
          response: token,
        },
      });

      const { success, score, "error-codes": errors } = response.data;

      if (success && score >= 0.7) {
        res.status(200).json({
          isValid: true,
        });
      } else {
        res.status(200).json({
          isValid: false,
          score: score,
          errors: errors || "Low score or invalid token",
        });
      }
    } catch (error) {
      res.status(500).json({
        isValid: false,
        message: "Internal Server Error during validation",
      });
    }
  },
);
