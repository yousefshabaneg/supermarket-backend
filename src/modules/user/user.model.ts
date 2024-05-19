import custom from "../../shared/types/custom";
import mongoose, { Document, Model, ObjectId } from "mongoose";
import UserRoles, {
  userRoleArray,
  UserRoleType,
} from "../../shared/types/userRoles.enum";
import { IBranch } from "../branch/branch.model";
import config from "../../shared/config/config";
import jwt, { JwtPayload } from "jsonwebtoken";
import validator from "validator";
import bcryptjs from "bcryptjs";
import AppError from "../../shared/helpers/AppError";

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  password?: string;
  role: UserRoleType;
  branchId: ObjectId | IBranch;
  correctPassword(candidatePassword: string): Promise<boolean>;
  generateToken(): Promise<string>;
}

interface UserModel extends Model<IUser> {
  login: (email: string, password: string) => Promise<any>;
  verifyToken: (token: string) => Promise<JwtPayload>;
}

const userSchema = new mongoose.Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
    },
    email: {
      type: String,
      required: [true, "email required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "password required"],
      minlength: [6, "password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: userRoleArray,
      default: UserRoles.Cashier,
    },
    branchId: {
      type: mongoose.Types.ObjectId,
      ref: "Branch",
    },

    image: { type: String, default: "user-avatar.jpeg" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcryptjs.hash(this.password!, 12);
  next();
});

userSchema.statics.login = async (email, password) => {
  // check if user is exist.
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) throw AppError.NotFoundException("User doest not exist");

  // validate password.
  const checkPassword = await user.correctPassword(password);
  if (!checkPassword)
    throw AppError.NotAuthenticatedException("Wrong Password, try again...");

  //delete password
  delete user.password;
  return user;
};

userSchema.methods.correctPassword = async function (
  candidatePassword: string
) {
  return await bcryptjs.compare(candidatePassword, this.password);
};

userSchema.methods.generateToken = async function () {
  const user = { email: this.email, id: this._id, role: this.role };

  const token = jwt.sign({ user }, config.jwtSecret, {
    expiresIn: config.jwtExpiration,
  });
  return token;
};

userSchema.statics.verifyToken = async function (token): Promise<JwtPayload> {
  if (!token) throw AppError.InvalidDataException("Token is required");
  const decodedToken = jwt.verify(token, config.jwtSecret) as JwtPayload;
  if (!decodedToken.user)
    throw AppError.NotFoundException("User doest not exist");

  return decodedToken;
};

// return user image as url
function setImageUrl(doc: any) {
  if (doc.image) {
    const imageUrl = `${config.baseUrl}/users/${doc.image}`;
    doc.image = imageUrl;
  }
}
// /^find/,update,
userSchema.post<any>("init", setImageUrl);

// create
userSchema.post<any>("save", setImageUrl);

userSchema.methods.toJSON = function () {
  const data = this.toObject();
  delete data.__v;
  delete data.password;
  delete data.createdAt;
  delete data.updatedAt;
  return data;
};

const UserModel = mongoose.model<IUser, UserModel>("User", userSchema);

export default UserModel;
