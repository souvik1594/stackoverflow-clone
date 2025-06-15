import { IndexType, Permission } from "node-appwrite";
import { db, questionsCollection } from "../name";
import { databases } from "./config";

export default async function createQuestionCollection() {
  await databases.createCollection(
    db,
    questionsCollection,
    questionsCollection,
    [
      Permission.read("any"),
      Permission.read("users"),
      Permission.create("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ]
  );
  console.log("question collection created");

  //creating attributes & Indexes
  await Promise.all([
    databases.createStringAttribute(
      db,
      questionsCollection,
      "title",
      255,
      true
    ),
    databases.createStringAttribute(
      db,
      questionsCollection,
      "content",
      10000,
      true
    ),
    databases.createStringAttribute(
      db,
      questionsCollection,
      "authorId",
      50,
      true
    ),
    databases.createStringAttribute(
      db,
      questionsCollection,
      "tag",
      50,
      true,
      undefined,
      true
    ),
    databases.createStringAttribute(
      db,
      questionsCollection,
      "attachmentId",
      50,
      false
    ),
  ]);

  console.log("attributes created");

  //Create Indexes
  await Promise.all([
    databases.createIndex(
      db,
      questionsCollection,
      "title",
      IndexType.Fulltext,
      ["title"],
      ["asc"]
    ),
    databases.createIndex(
      db,
      questionsCollection,
      "content",
      IndexType.Fulltext,
      ["content"],
      ["asc"]
    ),
  ]);
  console.log("indexes created");
}
