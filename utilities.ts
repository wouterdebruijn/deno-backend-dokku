import { BaseEntity } from "./entities/BaseEntity.ts";
import { User } from "./entities/User.ts";

export const cleanHex = (hex: string) => {
  // Re-add the dashes and turn the string into lowercase
  const dashed = `${hex.substr(0, 8)}-${hex.substr(8, 4)}-${
    hex.substr(12, 4)
  }-${hex.substr(16, 4)}-${hex.substr(20)}`;
  const lower = dashed.toLowerCase();

  return lower;
};

export const isPassword = (password: string) => {
  // Copied RegExp from https://stackoverflow.com/a/5142164
  const regex = new RegExp(
    /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/,
  );
  return regex.test(password);
};

export const isEmail = (email: string) => {
  // Copied RegExp from https://stackoverflow.com/a/46181
  const regex = new RegExp(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
  return regex.test(email);
};

export const isShortString = (input: string) => {
  return input.length >= 2 && input.length <= 31;
};

export const isNormalString = (input: string) => {
  return input.length >= 2 && input.length <= 255;
};

export const isLongString = (input: string) => {
  return input.length >= 2 && input.length <= 4096;
};

export const isUuid = (input: string) => {
  return input.length === 36 && input.includes("-", 9);
};