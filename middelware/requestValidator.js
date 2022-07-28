import jwt from "jsonwebtoken";
export default function requestValidator(handler) {
  return async (req, res) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).send({ message: "token is not supplied" });
    }
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(400).send({ message: "the token is invalid" });
      }
      req.user = decode;
    });
    return handler(req, res);
  };
}
