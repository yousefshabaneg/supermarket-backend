import AppError from "../helpers/AppError";

enum UserRoles {
  Admin = "Admin",
  Cashier = "Cashier",
}

type UserRoleKeys = keyof typeof UserRoles;

type UserRoleValues = (typeof UserRoles)[UserRoleKeys];

export type UserRoleType = `${Capitalize<UserRoleValues>}`;

export const userRoleArray: UserRoleValues[] = Object.values(UserRoles);

export const validateRole = (value: any) => {
  if (!userRoleArray.includes(value)) {
    throw AppError.InvalidDataException(
      `role is not correct, role must be one of these roles: ${userRoleArray}`
    );
  }
  return true;
};

export default UserRoles;
