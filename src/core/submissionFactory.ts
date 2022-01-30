import $ from "assert";
import parser from "xml2js";
import { Session } from "./session";

interface IQuestion {
  name: string;
  score: number;
}

interface ISubmitData {
  [qNumber: string]: number | string;
  taskID: string;
  realID: string;
  studentID: string;
  sCode: number;
  authToken: string; // _ra_token
}

const genSCode = (authCode: string, taskId: string, q1: number, q2: number) => {
  const intAuthCode = Number(authCode);
  const intTaskId = Number(taskId);

  let sCode = intAuthCode * intTaskId;

  sCode += q1 * 100 + q2;
  sCode *= 10000;
  sCode += intTaskId * intTaskId;

  return sCode;
};

const fromUrl = (url: string, key: string) => {
  const params = new URLSearchParams(url);

  const value = params.get(key);

  $(value);

  return value;
};

const getQuestions = async (agent: Session, url: string) => {
  return new Promise<IQuestion[]>(async (resolve, reject) => {
    const page = await agent.getRaw(url);

    $(typeof page === "string");

    parser.parseString(page, (error, res) => {
      $(!error);
      $(typeof res === "object");

      const homeworkRegion = res.homework;
      $(typeof homeworkRegion === "object");

      const xmlQuestions = homeworkRegion.homeworkQuestion;
      $(Array.isArray(xmlQuestions));

      console.log();

      const questions = xmlQuestions.map((q): IQuestion => {
        const name = q.$.questiontitle;
        $(typeof name === "string");

        const marks = q.$.questionmarks;
        $(typeof marks === "string");

        return {
          name: name,
          score: Number(marks),
        };
      });

      resolve(questions);
    });
  });
};

export const createSubmission = async (src: string, agent: Session) => {
  const taskId = fromUrl(src, "taskID");
  const realId = fromUrl(src, "realID");
  const studentId = fromUrl(src, "studentID");
  const authCode = fromUrl(src, "authCode");

  const xmlPath =
    fromUrl(src, "assetHost") + fromUrl(src, "contentPath") + "content.xml";

  const questions = await getQuestions(agent, xmlPath);

  const submit: ISubmitData = {
    authToken: agent.csrf as string,
    realID: realId,
    taskID: taskId,
    sCode: genSCode(authCode, taskId, questions[0].score, questions[1].score),
    studentID: studentId,
  };

  questions.forEach((v, i) => {
    submit[`q${i + 1}score`] = v.score;
  });

  return submit;
};
