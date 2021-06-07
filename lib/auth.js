const jwt = require('jsonwebtoken');

const secretKey = "SuperSecret";

function generateAuthToken(userId) {
  const payload = { sub: userId };
  return jwt.sign(payload, secretKey, { expiresIn: '24h' });
}
exports.generateAuthToken = generateAuthToken;

function requireAuthentication(req, res, next) {
  console.log("  -- verifying authentication");
  const authHeader = req.get('Authorization') || '';
  const authHeaderParts = authHeader.split(' ');
  console.log("  -- authHeaderParts:", authHeaderParts);
  const token = authHeaderParts[0] === 'Bearer' ? authHeaderParts[1] : null;

try{
    const payload = jwt.verify(token, secretKey);
    req.user = payload.sub;
    next();
  } catch (err) {

  res.status(401).send({
      error: "Invalid authentication token."
    });
  }
}
exports.requireAuthentication = requireAuthentication;