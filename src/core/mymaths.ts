import { Session } from "./session";
import $ from "assert";
import { createHomework, IHomework } from "./homeworkFactory";
import { createSubmission } from "./submissionFactory";

const enum Urls {
  LOGIN = "https://login.mymaths.co.uk/login",
  STUDENT_AUTH = "https://app.mymaths.co.uk/myportal/student/authenticate",
  LIBRARY = "https://app.mymaths.co.uk/myportal/library/9",
  HOMEWORK = "https://app.mymaths.co.uk/myportal/student/my_homework",
  MARK = "https://app.mymaths.co.uk/api/legacy/save/mark",
}

export class MyMaths {
  private session = new Session();

  public async login(schUn: string, schPwd: string, un: string, pwd: string) {
    return new Promise<void>(async (resolve, reject) => {
      await this.session.get(Urls.LOGIN);

      await this.session.post(Urls.LOGIN, {
        "account[user_name]": schUn,
        "account[password]": schPwd,
        commit: "Log in",
      });

      await this.session.get(Urls.LIBRARY, {
        login_modal: true,
      });

      const success = await this.session.post(Urls.STUDENT_AUTH, {
        "student[user_name]": un,
        "student[password]": pwd,
        commit: "Log in",
      });

      success ? resolve() : reject("Could not sign in");
    });
  }

  public async getHomework() {
    return new Promise<IHomework[]>(async (resolve, reject) => {
      const page = await this.session.get(Urls.HOMEWORK);

      const trees = page.window.document.getElementsByClassName(
        "accordion-group accordion-blue"
      );

      const homework: IHomework[] = [];

      for (const tree of trees) {
        const hw = createHomework(tree);
        homework.push(hw);
      }

      homework.length > 0
        ? resolve(homework)
        : reject("Could not retrieve homework");
    });
  }

  public async solveHomework(hw: IHomework) {
    return new Promise<number>(async (resolve, reject) => {
      const page = await this.session.get(hw.url.toString());

      const src = page.window.document
        .getElementById("player")
        ?.attributes.getNamedItem("src")?.value;

      $(src);

      const submission = await createSubmission(src, this.session);

      const y = Urls.MARK;

      const res = await this.session.post(Urls.MARK, submission);

      resolve(res);
    });
  }
}
