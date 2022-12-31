const User = require("../models/User");
const passport = require("passport");
const RequestService = require("../services/RequestService");

// import and instantiate our userOps object
const ProfileOps = require("../data/ProfileOps")
const UserOps = require("../data/UserOps");
const _userOps = new UserOps();
const _profileOps = new ProfileOps();

// Displays registration form.
exports.Register = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  res.render("user/register", { errorMessage: "", user: {}, reqInfo: reqInfo, title: "Yearbook - Register"});
};

// Handles 'POST' with registration form submission.
exports.RegisterUser = async function (req, res) {
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;

  if (password == passwordConfirm) {
    // Creates user object with mongoose model.
    // Note that the password is not present.
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      imagePath: req.body.imagePath,
      roles: [req.body.admin, req.body.manager]
    });

    // Uses passport to register the user.
    // Pass in user object without password
    // and password as next parameter.
    User.register(
      new User(newUser),
      req.body.password,
      function (err, account) {
        // Show registration form with errors if fail.
        if (err) {
          let reqInfo = RequestService.reqHelper(req);
          return res.render("user/register", {
            user: newUser,
            errorMessage: err,
            reqInfo: reqInfo,
            title: "Yearbook - Register"
          });
        }
        // User registered so authenticate and redirect to profile
        passport.authenticate("local")(req, res, function () {
          res.redirect("/user/profile/");
        });
      }
    );
  } else {
    let reqInfo = RequestService.reqHelper(req);
    res.render("user/register", {
      user: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
      },
      errorMessage: "Passwords do not match.",
      reqInfo: reqInfo,
      title: "Yearbook - Register"
    });
  }
};

// Shows login form.
exports.Login = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  let errorMessage = req.query.errorMessage;

  res.render("user/login", {
    user: {},
    errorMessage: errorMessage,
    reqInfo: reqInfo,
    title: "Yearbook - Login"
  });
};

// Receives login information & user roles, then store roles in session and redirect depending on authentication pass or fail.
exports.LoginUser = async (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: `/user/profile/`,
    failureRedirect: "/user/login?errorMessage=Invalid login.",
  })(req, res, next);
};

// Log user out and direct them to the login screen.
exports.Logout = (req, res) => {
  // Use Passports logout function
  req.logout((err) => {
    if (err) {
      console.log("logout error");
      return next(err);
    } else {
      // logged out.  Update the reqInfo and redirect to the login page
      let reqInfo = RequestService.reqHelper(req);

      res.render("index", {
        user: {},
        isLoggedIn: false,
        errorMessage: "",
        reqInfo: reqInfo,
        title: "Logout"
      });
    }
  });
};

exports.Index = async function (request, response) {
  console.log("loading profiles from controller");
  let reqInfo = RequestService.reqHelper(request);
  if (reqInfo.authenticated) {
    let roles = await _userOps.getRolesByUsername(reqInfo.username);
    let sessionData = request.session;
    sessionData.roles = roles;
    reqInfo.roles = roles;
    let userInfo = await _userOps.getUserByUsername(reqInfo.username);
    let profiles = await _profileOps.getAllProfiles();
    console.log(profiles)
    if (profiles) {
      response.render("user/profiles", {
        reqInfo: reqInfo,
        userInfo: userInfo,
        searchString: "",
        sortBy:"",
        title: "Yearbook - Profiles",
        profiles: profiles, 
        layout: "./layouts/full-width"
      });
    } else {
      response.render("user/profiles", {
        reqInfo: reqInfo,
        userInfo: userInfo,
        title: "Yearbook - Profiles",
        profiles: [],
        layout: './layouts/full-width'
      });
    }
  } else {
    response.redirect(
      "/user/login?errorMessage=You must be logged in to view this page."
    );
  }
};

exports.Search = async function (req, response) {
  console.log("loading profiles from controller");
  let reqInfo = RequestService.reqHelper(req);
  if (reqInfo.authenticated) {
    let roles = await _userOps.getRolesByUsername(reqInfo.username);
    let sessionData = req.session;
    sessionData.roles = roles;
    reqInfo.roles = roles;
    let userInfo = await _userOps.getUserByUsername(reqInfo.username);
    let profiles = await _profileOps.searchAllProfiles(req.body.searchString, req.body.sortBy);
    if (profiles) {
      response.render("user/profiles", {
        reqInfo: reqInfo,
        userInfo: userInfo,
        searchString: req.body.searchString,
        sortBy:req.body.sortBy,
        title: "Yearbook - Profiles",
        profiles: profiles, 
        layout: "./layouts/full-width"
      });
    } else {
      response.render("user/profiles", {
        reqInfo: reqInfo,
        userInfo: userInfo,
        title: "Yearbook - Profiles",
        profiles: [],
        layout: './layouts/full-width'
      });
    }
  } else {
    response.redirect(
      "/user/login?errorMessage=You must be logged in to view this page."
    );
  }
};

exports.Detail = async function (request, response) {
    const profileId = request.params.id;
    console.log(`loading single profile by id ${profileId}`);
    let reqInfo = RequestService.reqHelper(request);
    let managerInfo = RequestService.reqHelper(request, ["Admin", "Manager"]);
    let adminInfo = RequestService.reqHelper(request, ["Admin"]);
  if (reqInfo.authenticated) {
    let roles = await _userOps.getRolesByUsername(reqInfo.username);
    let sessionData = request.session;
    sessionData.roles = roles;
    reqInfo.roles = roles;
    let userInfo = await _userOps.getUserByUsername(reqInfo.username);
    let profile = await _profileOps.getProfileById(profileId);
    let profiles = await _profileOps.getAllProfiles();
    if (profile) {
        response.render("user/profile", {
          reqInfo: reqInfo,
          userInfo: userInfo,
          isManager: managerInfo.rolePermitted,
          isAdmin: adminInfo.rolePermitted,
          title: "Yearbook - " + profile.firstName + " " + profile.lastName,
          profiles: profiles,
          profileId: request.params.id,
          layout: "./layouts/sidebar",
        });
    } else {
        response.render("user/profiles", {
          reqInfo: reqInfo,
          userInfo: userInfo,
          title: "Yearbook - Profiles",
          profiles: [],
          layout: './layouts/full-width'
        });
    }
  }
};

exports.Create = async function (request, response) {
  let reqInfo = RequestService.reqHelper(request);
  if (reqInfo.authenticated) {
    let roles = await _userOps.getRolesByUsername(reqInfo.username);
    let sessionData = request.session;
    sessionData.roles = roles;
    reqInfo.roles = roles;
    let userInfo = await _userOps.getUserByUsername(reqInfo.username);
    response.render("user/profile-form", {
        reqInfo: reqInfo,
        userInfo: userInfo,
        title: "Create Profile",
        errorMessage: "",
        profile: {},
        profile_id: "",
        layout: './layouts/full-width'
    });
  };
};

exports.CreateProfile = async function (request, response) {
    let tempProfileObj = new Profile({
        name: request.body.name,
    });

    let responseObj = await _profileOps.createProfile(tempProfileObj);

    if (responseObj.errorMsg == "") {
      let reqInfo = RequestService.reqHelper(request);
      if (reqInfo.authenticated) {
        let roles = await _userOps.getRolesByUsername(reqInfo.username);
        let sessionData = request.session;
        sessionData.roles = roles;
        reqInfo.roles = roles;
        let userInfo = await _userOps.getUserByUsername(reqInfo.username);
        let profiles = await _profileOps.getAllProfiles();
        console.log(responseObj.obj);
        response.render("user/profile", {
          reqInfo: reqInfo,
          userInfo: userInfo,
          title: "Yearbook - " + responseObj.obj.name,
          profiles: profiles,
          profileId: responseObj.obj._id.valueOf(),
          layout: "./layouts/sidebar",
        });
      };
    }

    else {
        console.log("An error occured. Item not created.");
        response.render("user/profile-create", {
        title: "Create Profile",
        profile: responseObj.obj,
        errorMessage: responseObj.errorMsg,
        });
    }
};

exports.DeleteProfileById = async function (request, response) {
  let reqInfo = RequestService.reqHelper(request);
  if (reqInfo.authenticated) {
    let roles = await _userOps.getRolesByUsername(reqInfo.username);
    let sessionData = request.session;
    sessionData.roles = roles;
    reqInfo.roles = roles;
    let userInfo = await _userOps.getUserByUsername(reqInfo.username);
    const profileId = request.params.id;
    console.log(`deleting single profile by id ${profileId}`);
    let deletedProfile = await _profileOps.deleteProfileById(profileId);
    let profiles = await _profileOps.getAllProfiles();
    if (deletedProfile) {
      response.render("index", {
        reqInfo: {},
        userInfo: {},
        title: "Yearbook",
        profiles: profiles,
        layout: './layouts/full-width'
      });
    } else {
      response.render("profiles", {
        title: "Yearbook - Profiles",
        profiles: profiles,
        errorMessage: "Error.  Unable to Delete",
        layout: './layouts/full-width'
      });
    }
  }
};

exports.Edit = async function (request, response) {
  let reqInfo = RequestService.reqHelper(request);
  let adminInfo = RequestService.reqHelper(request, ["Admin"]);
  let managerInfo = RequestService.reqHelper(request, ["Admin", "Manager"]);
  if (reqInfo.authenticated) {
    let roles = await _userOps.getRolesByUsername(reqInfo.username);
    let sessionData = request.session;
    sessionData.roles = roles;
    reqInfo.roles = roles;
    let userInfo = await _userOps.getUserByUsername(reqInfo.username);
    const profileId = request.params.id;
    let profileObj = await _profileOps.getProfileById(profileId);
    response.render("user/profile-form", {
      reqInfo: reqInfo,
      userInfo: userInfo,
      isAdmin: adminInfo.rolePermitted,
      isManager: managerInfo.rolePermitted,
      title: "Edit Profile",
      errorMessage: "",
      profile_id: profileId,
      profile: profileObj,
      layout: './layouts/full-width'
    });
  }
};

exports.EditProfile = async function (request, response) {
    console.log(request.body);
    const email = request.body.email;
    const username = request.body.username;
    const profileId = request.body.profile_id;
    const firstName = request.body.firstName;
    const lastName = request.body.lastName;
    const imagePath = request.body.imagePath;
    const interests = (request.body.interests).split(",");
    const roles = [request.body.Manager, request.body.Admin]
    let responseObj = await _profileOps.updateProfileById(profileId, firstName, lastName, interests, email, username, imagePath, roles);

    if (responseObj.errorMsg == "") {
      let reqInfo = RequestService.reqHelper(request);
      let managerInfo = RequestService.reqHelper(request, ["Admin", "Manager"]);
      let adminInfo = RequestService.reqHelper(request, ["Admin"]);
        if (reqInfo.authenticated) {
        let roles = await _userOps.getRolesByUsername(reqInfo.username);
        let sessionData = request.session;
        sessionData.roles = roles;
        reqInfo.roles = roles;
        let userInfo = await _userOps.getUserByUsername(reqInfo.username);
        let profiles = await _profileOps.getAllProfiles();
        response.render("user/profile", {
          reqInfo: reqInfo,
          userInfo: userInfo,
          isManager: managerInfo.rolePermitted,
          isAdmin: adminInfo.rolePermitted,
          title: "Yearbook - " + responseObj.obj.name,
          profiles: profiles,
          profileId: responseObj.obj._id.valueOf(),
          layout: "./layouts/sidebar",
        });
      };
    }

    else {
      console.log("An error occured. Item not updated.", responseObj.errorMsg);
      response.render("user/profile-form", {
        title: "Edit Profile",
        profile: responseObj.obj,
        profileId: profileId,
        errorMessage: responseObj.errorMsg,
        layout: './layouts/full-width'
      });
    }
};

exports.Comment = async function (request, response) {
    const profileId = request.body.profile_id;
    const author = request.body.author;
    const comment = request.body.comment;
    let responseObj = await _profileOps.updateCommentById(profileId, author, comment);
    let adminInfo = RequestService.reqHelper(request, ["Admin"]);
    let managerInfo = RequestService.reqHelper(request, ["Admin", "Manager"]);
    if (responseObj.errorMsg == "") {
      let reqInfo = RequestService.reqHelper(request);
        if (reqInfo.authenticated) {
        let roles = await _userOps.getRolesByUsername(reqInfo.username);
        let sessionData = request.session;
        sessionData.roles = roles;
        reqInfo.roles = roles;
        let userInfo = await _userOps.getUserByUsername(reqInfo.username);
        let profiles = await _profileOps.getAllProfiles();
        response.render("user/profile", {
          reqInfo: reqInfo,
          userInfo: userInfo,
          isAdmin: adminInfo.rolePermitted,
          isManager: managerInfo.rolePermitted,
          title: "Yearbook - " + responseObj.obj.name,
          profiles: profiles,
          profileId: responseObj.obj._id.valueOf(),
          layout: "./layouts/sidebar",
        });
      };
    }

    else {
      console.log("An error occured. Item not updated.", responseObj.errorMsg);
      response.render("user/profile-form", {
        title: "Edit Profile",
        profile: responseObj.obj,
        profileId: profileId,
        errorMessage: responseObj.errorMsg,
        layout: './layouts/full-width'
      });
    }
};

exports.Profile = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  if (reqInfo.authenticated) {
    console.log(reqInfo);
    let roles = await _userOps.getRolesByUsername(reqInfo.username);
    let sessionData = req.session;
    sessionData.roles = roles;
    reqInfo.roles = roles;
    let userInfo = await _userOps.getUserByUsername(reqInfo.username);
    let profileId = reqInfo.id;
    let profile = await _profileOps.getProfileById(profileId);
    let profiles = await _profileOps.getAllProfiles();
    return res.render("user/profile", {
      reqInfo: reqInfo,
      userInfo: userInfo,
      title: "Yearbook - " + profile.firstName + " " + profile.lastName,
      profile: profile,
      profiles: profiles,
      profileId: profileId,
      layout: "./layouts/sidebar",
    });
  } else {
    res.redirect(
      "/user/login?errorMessage=You must be logged in to view this page."
    );
  }
};
