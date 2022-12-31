const RequestService = require("../services/RequestService");
const UserOps = require("../data/UserOps");
const _userOps = new UserOps();

exports.Index = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  if (reqInfo.authenticated) {
    let roles = await _userOps.getRolesByUsername(reqInfo.username);
    let sessionData = req.session;
    sessionData.roles = roles;
    reqInfo.roles = roles;
    let userInfo = await _userOps.getUserByUsername(reqInfo.username);
    console.log(reqInfo)
    return res.render("index", { reqInfo: reqInfo, userInfo: userInfo, title: "Yearbook"});
  }
  else {
    return res.render("index", {reqInfo: {}, userInfo: {}, title: "Yearbook"});
  }
};
