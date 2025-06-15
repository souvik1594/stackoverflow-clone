import { db } from "../name";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comments.collection";
import createQuestionCollection from "./questions.collection";
import createVoteCollection from "./vote.collection";
import { databases } from "./config";

export default async function dbSetup() {
  try {
    await databases.get(db);
    console.log("database connected");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    try {
      await databases.create(db, db);
      console.log("database created");
      await Promise.all([
        createQuestionCollection(),
        createAnswerCollection(),
        createCommentCollection(),
        createVoteCollection(),
      ]);
      console.log("all collections created");
      console.log("database connected");
    } catch (error) {
      console.log("error creating database" + error);
    }
  }
  return databases;
}
