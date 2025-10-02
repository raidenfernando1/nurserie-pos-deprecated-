import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const useSession = () => {
  const router = useRouter();

  const getSession = async () => {
    const session = await authClient.getSession();
    return session;
  };

  const getID = async () => {
    const session = await authClient.getSession();
    const id = session.data?.user.id;

    return { userID: id };
  };

  const getRole = async () => {
    const session = await authClient.getSession();
    const role = session.data?.user.role;

    return { role: role };
  };

  const checkSession = async ({
    intendedRole,
  }: {
    intendedRole: "user" | "admin";
  }) => {
    const session = await authClient.getSession();
    const role = session.data?.user.role;

    if (role !== intendedRole) {
      router.replace("/error?msg=unauthorized");
      return;
    }

    return { proceed: true, error: null };
  };

  return { getSession, getID, checkSession };
};

export default useSession;
