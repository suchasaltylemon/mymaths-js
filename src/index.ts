import { MyMaths } from "./core/mymaths";
import inquirer from "inquirer";
import $ from "assert";

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

const main = () => {
  inquirer
    .prompt([
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
    ])
    .then((answers) => {
      const schoolUsername = answers.schoolUsername;
      $(typeof schoolUsername === "string");

      const schoolPassword = answers.schoolPassword;
      $(typeof schoolPassword === "string");

      const studentUsername = answers.studentUsername;
      $(typeof studentUsername === "string");

      const studentPassword = answers.studentPassword;
      $(typeof studentPassword === "string");

      const mymaths = new MyMaths();

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
    });
};

main();
