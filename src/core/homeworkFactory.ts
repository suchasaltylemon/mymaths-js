import $ from "assert";

export interface IHomework {
  name: string;
  url: URL;
}

export const createHomework = (tree: Element): IHomework => {
  const name = tree.getElementsByClassName("topic_name_task")[0].innerHTML;
  const url = tree
    .getElementsByClassName("mycon-homework-blue")[0]
    .parentElement?.attributes.getNamedItem("href")?.value;

  $(url);
  $(name);

  return {
    name: name,
    url: new URL("https://app.mymaths.co.uk" + url),
  };
};
