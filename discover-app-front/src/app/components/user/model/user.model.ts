import { CommonModel } from "../../../base/model/common.model";

export interface UserModel extends CommonModel{
  username?: string;
  bio?: string;
  avatar?: string;
  email?: string;
  password?: string;
}
