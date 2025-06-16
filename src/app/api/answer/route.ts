import { databases, users } from "@/models/server/config";
import { ID } from "node-appwrite";
import { NextRequest, NextResponse } from "next/server";
import { db, answersCollection } from "@/models/name";
import { UserPrefs } from "@/store/auth";

export async function POST(request: NextRequest) {
  try {
    const { questionId, answer, authorId } = await request.json();
    if (!questionId || !answer || !authorId) {
      return NextResponse.json(
        {
          error: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }
    const response = await databases.createDocument(
      db,
      answersCollection,
      ID.unique(),
      {
        questionId: questionId,
        content: answer,
        authorId: authorId,
      }
    );

    // increase author reputation
    const prefs = await users.getPrefs<UserPrefs>(authorId);
    if (prefs) {
      await users.updatePrefs<UserPrefs>(authorId, {
        reputation: prefs.reputation + 10,
      });
    }

    return NextResponse.json(
      { message: "successfully posted the answer" },
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      {
        status: 500,
      }
    );
  }
}
export async function DELETE(request: NextRequest) {
  try {
    const { answerId } = await request.json();

    const ans = await databases.getDocument(db, answersCollection, answerId);
    await databases.deleteDocument(db, answersCollection, answerId);

    return NextResponse.json(
      { message: "successfully deleted the answer" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete the answer",
      },
      {
        status: 500,
      }
    );
  }
}
