import { Permission } from "node-appwrite";
import { questionsAttachmentBucket } from "../name";
import { storage } from "./config";

export default async function createStorageCollection() {
  try {
    await storage.getBucket(questionsAttachmentBucket);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    try {
      await storage.createBucket(
        questionsAttachmentBucket,
        questionsAttachmentBucket,
        [
          Permission.read("any"),
          Permission.read("users"),
          Permission.create("users"),
          Permission.update("users"),
          Permission.delete("users"),
        ],
        false,
        undefined,
        undefined,
        ["jpg", "jpeg", "png", "gif", "svg", "webp", "heic", "heif"]
      );
      console.log("storage collection created");
    } catch (error) {
      console.log("error creating Storage Collection" + error);
    }
  }
}
