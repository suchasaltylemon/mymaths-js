import {
  schoolPassword,
  schoolUsername,
  studentPassword,
  studentUsername,
} from "../auth.json";
import { MyMaths } from "./core/mymaths";

const mymaths = new MyMaths();

const url = "https://app.mymaths.co.uk/362-homework/cumulative-frequency-1";

mymaths
  .login(schoolUsername, schoolPassword, studentUsername, studentPassword)
  .then(async () => {
    await mymaths.solveHomeworkFromUrl(url);
  });
