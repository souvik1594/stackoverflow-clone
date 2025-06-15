import { Permission } from "node-appwrite";
import { db, commentsCollection } from "../name";
import { databases } from "./config";

export default async function createCommentCollection() {
  await databases.createCollection(db, commentsCollection, commentsCollection, [
    Permission.read("any"),
    Permission.read("users"),
    Permission.create("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);
  console.log("comments collection created");

  await Promise.all([
    databases.createStringAttribute(
      db,
      commentsCollection,
      "content",
      10000,
      true
    ),
    databases.createEnumAttribute(
      db,
      commentsCollection,
      "type",
      ["question", "answer"],
      true
    ),
    databases.createStringAttribute(db, commentsCollection, "typeId", 50, true),
    databases.createStringAttribute(
      db,
      commentsCollection,
      "authorId",
      50,
      true
    ),
  ]);

  console.log("attributes created");
}
