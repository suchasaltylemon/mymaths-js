import { IHomework } from "./homeworkFactory";
import $ from "assert";

interface IScore {
  questionNumber: number;
  score: number;
}

interface ISubmitData {
  taskID: string;
  realID: string;
  scores: IScore[];
  studentID: string;
  sCode: number;
  authToken: string; // _ra_token
}

const genSCode = (authCode: string, taskId: string, q1: string, q2: string) => {
  const intAuthCode = Number(authCode);
  const intTaskId = Number(taskId);

  let sCode = intAuthCode * intTaskId;

  sCode += Number(q1) * 100 + Number(q2);
  sCode *= 10000;
  sCode += intTaskId * intTaskId;

  return sCode;
};

const getTaskId = (src: string) => {
  const params = new URLSearchParams(src);

  const taskid = params.get("taskID");

  $(taskid);

  return taskid;
};

const getQuestions = (player: Document) => {
  const questions = player.querySelectorAll("nav > id");

  console.log();
};

export const createSubmission = (
  authToken: string,
  hw: IHomework,
  player: Document,
  src: string
) => {
  const taskId = getTaskId(src);
  const realId = hw.url.pathname.replace("/", "").split("-homework")[0];
  const questions = getQuestions(player);

  const submit: ISubmitData = {
    authToken: authToken,
    realID: realId,
    sCode: genSCode(authToken, taskId, "", ""),
    studentID: "", // Get student id,
    taskID: taskId,
    scores: [],
  };

  return submit;
};

export const tsCode = () => {
  const sCode = genSCode("1759140", "1960", "6", "13");

  console.log();
};

//TODO: Find where auth token is, fix the JSDOM parser
