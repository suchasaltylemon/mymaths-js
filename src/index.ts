import {
  schoolPassword,
  schoolUsername,
  studentPassword,
  studentUsername,
} from "../auth.json";
import { MyMaths } from "./core/mymaths";

const mymaths = new MyMaths();

const test = new Map();
test.set("asda", "cheese");

mymaths
  .login(schoolUsername, schoolPassword, studentUsername, studentPassword)
  .then(() => {
    mymaths.getHomework().then((homework) => {
      homework.forEach((hw) => {
        mymaths.solveHomework(hw);
      });
    });
  });
