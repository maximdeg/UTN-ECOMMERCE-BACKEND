import User from "../models/user.model.js";

class UserRepository {
  static async getById(id) {
    const user = await User.findOne({ _id: id });
    return user;
  }

  static async getByEmail(email) {
    const user = await User.findOne({ email });
    return user;
  }

  static async saveUser(user) {
    return await user.save();
  }

  static async setEmailVerified(value, user_id) {
    const user = await UserRepository.getById(user_id);
    user.emailVerified = value;
    return await UserRepository.saveUser(user);
  }
}

export default UserRepository;
