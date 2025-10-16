import { authClient } from "@/lib/auth-client";
import useSession from "./useSession";
import { success } from "better-auth";

export function useAdminAuth() {

    async function login() {
        try {
            const response = await authClient.signIn.social({
                provider: "google",
                callbackURL: "/api/auth/check",
            });

            if (!response) return;

            const session = await authClient.getSession();
            const role = session.data?.user.role;

            if (role !== "admin") {
                throw new Error("Logged in user not admin");
            }

        } catch (e) {
            return false;
        }
    }

    const createCashier = async ({
        email,
        password,
        name,
    }: {
        email: string;
        password: string;
        name: string;
    }) => {
        const { getID, checkSession } = useSession();
        const sessionCheck = await checkSession({ intendedRole: "admin" });

        if (!sessionCheck?.proceed) {
            throw new Error(sessionCheck?.error || "Unauthorized");
        }

        const { userID: adminID } = await getID();

        try {
            const { data: user, error } = await authClient.admin.createUser({
                email: `${email}@placeholder.com`,
                password: password,
                name: name,
                role: "user",
                data: {
                    admin_id: adminID,
                },
            });
            if (error) {
                throw new Error(error.message);
            }
            return { success: true, user: user };
        } catch (error: any) {
            throw new Error(error.message || "Failed to create cashier");
        }
    };

    const banUser = async ({
        userId,
        banReason = ""
    }: {
        userId: string;
        banReason?: string;
    }) => {
        try {
            const { data, error } = await authClient.admin.banUser({
                userId,
            });
            if (error) {
                throw new Error(error.message);
            }

            return { success: true, data };
        } catch (error: any) {
            throw new Error(error.message || "Failed to ban user")
        }
    }

    const unbanUser = async (userId: string) => {
        try {
            const { data, error } = await authClient.admin.unbanUser({
                userId,
            });
            if (error) {
                throw new Error(error.message);
            }
            return { success: true, data };
        } catch (error: any) {
            throw new Error(error.message || "Failed to unban user")
        }
    }


    return { login, createCashier, banUser, unbanUser };
}