import axios from "axios";
import { JSDOM } from "jsdom";
import { stringify as str } from "qs";
import $ from "assert";
import { Cookie, CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0";

export class Session {
  private _csrf: string | undefined;
  private readonly agent;
  private readonly jar;

  public get auth() {
    return new Promise<string>(async (resolve, reject) => {
      const cookies = await this.jar.getCookies("https://app.mymaths.co.uk/");

      const auth = cookies.find((c) => c.key === "_ra_token");

      $(auth);

      resolve(auth.value);
    });
  }

  public get csrf() {
    return this._csrf;
  }

  constructor() {
    const jar = new CookieJar();

    this.agent = wrapper(
      axios.create({
        headers: {
          "user-agent": USER_AGENT,
          "content-type": "application/x-www-form-urlencoded",
          accept: "*",
          "accept-encoding": "gzip, deflate, br",
          connection: "keep-alive",
        },
        jar,
      })
    );

    this.jar = jar;
  }

  public async get(url: string, params: object = {}, doCsrf: boolean = true) {
    return new Promise<JSDOM>(async (resolve, reject) => {
      const res = await this.agent.get(url, {
        params: params,
      });

      const parsed = new JSDOM(res.data);

      if (doCsrf) {
        const csrf = parsed.window.document
          .querySelector('[name="csrf-token"]')
          ?.attributes.getNamedItem("content")?.value;

        $(csrf);

        this._csrf = csrf;
      }

      resolve(parsed);
    });
  }

  public async getRaw(url: string) {
    return new Promise<unknown>(async (resolve, reject) => {
      const res = await this.agent.get(url);

      resolve(res.data);
    });
  }

  public async post(url: string, data: object) {
    return new Promise<number>(async (resolve, reject) => {
      const payload = str({
        ...data,
        ...{ authenticity_token: this._csrf, utf8: "✓" },
      });

      const res = await this.agent.post(url, payload);

      resolve(res.status);
    });
  }
}
