import pako from "pako";
import { Base64 } from "js-base64";

export const encode = (data: object) => {
  const sanitised = JSON.stringify(data, (k, v) =>
    v === undefined ? "__undefined_decode_error" : v
  );

  return data
    ? Base64.encode(pako.gzip(sanitised, { level: 1, to: "string" }))
    : null;
};

export const decode = (data: string) => {
  const decodedData = data
    ? JSON.parse(
        pako.ungzip(Base64.decode(data), { to: "string" }).replace(/^"|"$/g, "")
      )
    : null;

  return decodedData;
};

export const lazy = (sanitised: string) =>
  Base64.encode(pako.gzip(sanitised, { level: 1, to: "string" }));
