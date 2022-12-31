const Profile = require("../models/User.js");

class ProfileOps {
  // empty constructor
  ProfileOps() {}
  // DB methods
  async getAllProfiles() {
    let profiles = await Profile.find({}).sort({lastName: 'asc'});

    return profiles;
  }

  async searchAllProfiles(searchString, sortOrder) {
    console.log(searchString, sortOrder)
    if (searchString != ""){
      var profiles = await Profile.find({$or: [{firstName: searchString}, {lastName: searchString}, {email: searchString}, {interests: searchString}]}).sort({lastName: sortOrder,firstName: sortOrder});
    }
    else {
      var profiles = await Profile.find({}).sort({lastName: sortOrder,firstName: sortOrder});
    }
    return profiles;
  }

  async getProfileById(id) {
    console.log(`getting profile by id ${id}`);
    let profile = await Profile.findById(id);
    return profile;
  }

  async getProfileByUsername(username) {
    console.log(`getting profile by username ${username}`);
    let profile = await Profile.findByUsername(username);
    return profile;
  }

  async createProfile(profileObj) {
    try {
      const error = await profileObj.validateSync();
      if (error) {
        const response = {
          obj: profileObj,
          errorMsg: error.message,
        };
        return response; // Exit if the model is invalid
      }
      // Model is valid, so save it
      const result = await profileObj.save();
      const response = {
        obj: result,
        errorMsg: "",
      };
      return response;
    } catch (error) {
      const response = {
        obj: profileObj,
        errorMsg: error.message,
      };
      return response;
    }
  }

  async deleteProfileById(id) {
    console.log(`deleting profile by id ${id}`);
    let result = await Profile.findByIdAndDelete(id);
    console.log(result);
    return result;
  }

  async updateProfileById(id, firstName, lastName, interests, email, username, imagePath, roles) {
    console.log(`updating profile by id ${id}`);
    const profile = await Profile.findById(id);
    console.log("original profile: ", profile);
    profile.username = username;
    profile.email = email;
    profile.firstName = firstName;
    profile.lastName = lastName;
    profile.interests = interests;
    profile.imagePath = imagePath;
    profile.roles = roles;
    let result = await profile.save();
    console.log("updated profile: ", result);
    return {
      obj: result,
      errorMsg: "",
    };
  }

  async updateCommentById(id, author, comment) {
    console.log(`updating comment on id ${id}`);
    const profile = await Profile.findById(id);
    console.log("original profile: ", profile);
    profile.comments.push({commentAuthor: author, commentBody: comment});
    let result = await profile.save();
    console.log("updated profile: ", result);
    return {
      obj: result,
      errorMsg: "",
    };
  }
}



module.exports = ProfileOps;