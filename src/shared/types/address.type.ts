import { ObjectId } from "mongoose";

type Address = {
  id?: ObjectId;
  alias?: string;
  details?: string;
  phone?: string;
  city?: string;
  postalCode?: string;
};

export default Address;
