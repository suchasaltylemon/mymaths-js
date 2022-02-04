import { MyMaths } from "./core/mymaths";
import inquirer from "inquirer";
import $ from "assert";
import fs from "fs/promises";

const solveFromUrl = async (mymaths: MyMaths) => {
  const ans = await inquirer.prompt({
    message: "URL",
    type: "input",
    name: "url",
  });

  const url = ans.url;
  $(typeof url === "string");

  await mymaths.solveHomeworkFromUrl(url);
};

const doAllHomework = (mymaths: MyMaths) => {
  mymaths.getHomework().then((homework) => {
    homework.forEach(async (hw) => {
      await mymaths.solveHomework(hw);
    });
  });
};

const getAuth = async () => {
  let schoolUsername: string, schoolPassword: string;
  let studentUsername: string, studentPassword: string;

  const res = await inquirer.prompt({
    message: "Load from auth.json?",
    type: "confirm",
    name: "json",
  });

  const loadFromJson = res.json;
  $(typeof loadFromJson === "boolean");

  if (loadFromJson) {
    const stream = await fs.readFile("./auth.json");
    const str = stream.toString();
    const decoded = JSON.parse(str);

    $(typeof decoded === "object");

    schoolUsername = decoded.schoolUsername;
    schoolPassword = decoded.schoolPassword;
    studentUsername = decoded.studentUsername;
    studentPassword = decoded.studentPassword;
  } else {
    const answers = await inquirer.prompt([
      {
        message: "School Username",
        type: "input",
        name: "schoolUsername",
      },
      {
        message: "School Password",
        type: "password",
        name: "schoolPassword",
      },
      {
        message: "Student Username",
        type: "input",
        name: "studentUsername",
      },
      {
        message: "Student Password",
        type: "password",
        name: "studentPassword",
      },
    ]);

    schoolUsername = answers.schoolUsername;
    schoolPassword = answers.schoolPassword;
    studentUsername = answers.studentUsername;
    studentPassword = answers.studentPassword;
  }

  $(typeof schoolUsername === "string");

  $(typeof schoolPassword === "string");

  $(typeof studentUsername === "string");

  $(typeof studentPassword === "string");

  return {
    schoolUsername,
    schoolPassword,
    studentUsername,
    studentPassword,
  };
};

const main = async () => {
  const mymaths = new MyMaths();

  const auth = await getAuth();
  $(auth);

  const { schoolUsername, schoolPassword, studentPassword, studentUsername } =
    auth;

  mymaths
    .login(schoolUsername, schoolPassword, studentUsername, studentPassword)
    .then(() => {
      inquirer
        .prompt({
          message: "What would you like to solve?",
          type: "list",
          name: "choice",
          choices: [
            {
              name: "Solve all homework",
              value: "all",
            },
            {
              name: "Solve from URL",
              value: "url",
            },
          ],
        })
        .then((answers) => {
          const choice = answers.choice;
          $(typeof choice === "string");

          choice === "all" ? doAllHomework(mymaths) : solveFromUrl(mymaths);
        });
    });
};

main();
