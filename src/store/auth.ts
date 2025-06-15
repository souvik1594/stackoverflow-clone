import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { AppwriteException, ID, Models } from "appwrite";
import { account } from "@/models/client/config";

export interface UserPrefs {
  reputation: number;
}

interface IAuthStore {
  session: Models.Session | null;
  jwt: string | null;
  user: Models.User<UserPrefs> | null;
  hydrated: boolean;
  setHydrated(): void;
  verifySession(): Promise<void>;
  login(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;
  createAccount(
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;
  logout(): Promise<void>;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set) => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,
      setHydrated() {
        set({ hydrated: true });
      },
      async verifySession() {
        try {
          const session = await account.getSession("current");
          set({
            session: session,
          });
        } catch (error) {
          console.log(error);
        }
      },
      async login(email: string, password: string) {
        try {
          const session = await account.createEmailPasswordSession(
            email,
            password
          );
          const [user, { jwt }] = await Promise.all([
            account.get<UserPrefs>(),
            account.createJWT(),
          ]);
          if (!user.prefs?.reputation)
            await account.updatePrefs({ reputation: user.prefs.reputation });
          set({ session, user, jwt });
          return { success: true };
        } catch (error) {
          return { success: false, error: error as AppwriteException | null };
        }
      },
      async createAccount(name, email, password) {
        try {
          await account.create(ID.unique(), name, email, password);
          return { success: true };
        } catch (error) {
          return { success: false, error: error as AppwriteException | null };
        }
      },
      async logout() {
        try {
          await account.deleteSessions();
          set({ session: null, user: null, jwt: null });
        } catch (error) {
          console.log(error);
        }
      },
    })),
    {
      name: "auth",
      onRehydrateStorage() {
        return (state?: IAuthStore, error?: unknown) => {
          if (!error) state?.setHydrated();
        };
      },
    }
  )
);
