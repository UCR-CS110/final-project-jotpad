// dev-only: all requests are authenticated as a single hardcoded user
const TEST_USER_ID = "000000000000000000000001"; 

module.exports.auth = (req, res, next) => {
  req.user = { id: TEST_USER_ID };
  next();
};