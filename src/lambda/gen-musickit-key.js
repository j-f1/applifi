// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const jwt = require("jsonwebtoken");

let key = "-----BEGIN PRIVATE KEY-----\n";
let remaining = process.env.MUSIC_KIT_PRIVATE_KEY;
while (remaining) {
  key += remaining.slice(0, 64) + "\n";
  remaining = remaining.slice(64);
}
key += "-----END PRIVATE KEY-----";

exports.handler = async () => {
  try {
    const jwtToken = jwt.sign({}, key, {
      algorithm: "ES256",
      expiresIn: "2 days",
      issuer: "288H3WAR3W",
      header: {
        alg: "ES256",
        kid: "53C2HV22M2",
        typ: "JWT",
      },
    });
    return {
      statusCode: 200,
      body: jwtToken,
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
