import { Session } from "./session";
import {
  schoolPassword,
  schoolUsername,
  studentPassword,
  studentUsername,
} from "../auth.json";

const sess = new Session();
sess
  .login(schoolUsername, schoolPassword, studentUsername, studentPassword)
  .then(() => {
    sess.getHomework();
  });
