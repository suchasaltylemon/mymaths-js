import { Axios, AxiosRequestConfig } from "axios";
import { JSDOM } from "jsdom";
import qs from "qs";

const str = (obj: object) => qs.stringify(obj);

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:96.0) Gecko/20100101 Firefox/96.0";

const urls = {
  LOGIN: "https://login.mymaths.co.uk/login",
  STUDENT_AUTH: "https://app.mymaths.co.uk/myportal/student/authenticate",
  LIBRARY: "https://app.mymaths.co.uk/myportal/library/9",
  HOMEWORK: "https://app.mymaths.co.uk/myportal/student/my_homework",
};

export class Session {
  private _session;
  private _loggedIn = false;

  constructor() {
    this._session = new Axios({
      headers: {
        "user-agent": USER_AGENT,
      },
    });
  }

  public async login(
    schoolUsername: string,
    schoolPassword: string,
    studentUsername: string,
    studentPassword: string
  ) {
    const options: AxiosRequestConfig = {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    };

    return new Promise<void>(async (resolve, rej) => {
      const loginPage = this._session.get(urls.LOGIN);
      const data = await (await loginPage).data;

      const loginParser = new JSDOM(data);
      const loginToken = loginParser.window.document
        .querySelector('[name="csrf-token"]')
        ?.attributes.getNamedItem("content")?.value;

      const payload = {
        authenticity_token: loginToken,
        "account[user_name]": schoolUsername,
        "account[password]": schoolPassword,
        commit: "Log in",
      };

      await this._session.post(urls.LOGIN, str(payload), options);

      const library = this._session.get(urls.LIBRARY, {
        params: {
          login_modal: true,
        },
      });

      const libraryParser = new JSDOM(await (await library).data);
      const authToken = libraryParser.window.document
        .querySelector('[name="csrf-token"]')
        ?.attributes.getNamedItem("content")?.value;

      await this._session.post(
        urls.STUDENT_AUTH,
        str({
          authenticity_token: authToken,
          "student[user_name]": studentUsername,
          "student[password]": studentPassword,
          commit: "Log in",
        })
      );

      resolve();
    });
  }

  public async getHomework() {
    return new Promise<void>(async (res, rej) => {
      const content = this._session.get(urls.HOMEWORK);
      const dom = new JSDOM((await content).data);

      //TODO: Fix this?
      const containers = dom.window.document.getElementsByClassName(
        "accordion-group accordion-blue"
      );

      const homeworks = [];

      for (const hw of containers) {
        const taskName = hw.getElementsByClassName("topic_name_task")[0];

        console.log(taskName);
      }
    });
  }
}
