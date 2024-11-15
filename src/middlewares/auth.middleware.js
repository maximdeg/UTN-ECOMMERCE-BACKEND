import jwt from "jsonwebtoken";
import ENV from "../config/enviroment.config.js";
import ResponseBuilder from "../utils/builders/responseBuilder.js";

export const verifyTokenMiddleware = (permited_roles = []) => {
  return (req, res, next) => {
    try {
      const auth_header = req.headers["authorization"];
      if (!auth_header) {
        const response = new ResponseBuilder()
          .setOk(false)
          .setStatus(401)
          .setMessage("Authorization missing")
          .setPayload({ detail: "Waiting for the authorization token" })
          .build();

        return res.status(401).json(response);
      }
      const access_token = auth_header;

      if (!access_token) {
        const response = new ResponseBuilder()
          .setOk(false)
          .setStatus(401)
          .setMessage("Authorization token malformed")
          .setPayload({ detail: "Waiting for a valid authorization token" })
          .build();

        return res.status(401).json(response);
      }

      const decoded = jwt.verify(access_token, ENV.JWT_SECRET);
      req.user = decoded;

      if (permited_roles.length && !permited_roles.includes(req.user.role)) {
        const response = new ResponseBuilder()
          .setOk(false)
          .setStatus(403)
          .setMessage("RESTRICTED_ACCESS")
          .setPayload({ detail: "You do not have the right permissions to realize this operation" })
          .build();

        return res.status(403).json(response);
      }
      return next();
    } catch (err) {
      const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(400)
        .setPayload({ detail: "Error on verification token function" })
        .setMessage("SERVER_ERROR")
        .build();

      res.status(500).json(response);
    }
  };
};

export const verifyApiKeyMiddleware = (req, res, next) => {
  try {
    const apikey_header = req.header("x-api-key");

    if (!apikey_header) {
      const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(401)
        .setMessage("Missing API KEY")
        .setPayload({ detail: "Waiting for an api-key" })
        .build();

      return res.status(401).json(response);
    }

    if (apikey_header !== ENV.INTERNAL_API_KEY) {
      const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(401)
        .setMessage("Unauthorized")
        .setPayload({ detail: "Waiting for a valid API KEY" })
        .build();

      return res.status(401).json(response);
    }

    return next();
  } catch (err) {
    const response = new ResponseBuilder()
      .setOk(false)
      .setStatus(400)
      .setPayload({ detail: "Couldn't get the API KEY" })
      .setMessage("INTERNAL_SERVER_ERROR")
      .build();

    res.status(500).json(response);
  }
};
