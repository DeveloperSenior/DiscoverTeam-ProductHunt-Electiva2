import { CommonModel } from "../../../base/model/common.model";
import { UserModel } from "../../user/model/user.model";

export interface ProductModel extends CommonModel{
  name?: string;
  description?: string;
  url?: string;
  tags?: string[];
  state?: string;
  user?: UserModel;
  launchAt?: Date;
}
