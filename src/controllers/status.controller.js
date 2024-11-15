import ResponseBuilder from "../utils/builders/responseBuilder.js";

export const getPingController = (req, res) => {
  try {
    const response = new ResponseBuilder()
      .setOk(true)
      .setStatus(200)
      .setMessage("SUCCESS")
      .setPayload({ message: "pong" })
      .build();

    res.status(200).json(response);
  } catch (err) {
    res
      .status(500)
      .json(response.setOk(true).setStatus(200).setMessage("ERROR en PING").setPayload({ detail: err.message }).build());
  }
};
