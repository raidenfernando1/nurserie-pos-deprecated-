import { authClient } from "@/lib/auth-client";
import useRole from "@/store/useRole";
import { useRouter } from "next/navigation";
import { Roles } from "@/types/user";
import { useEffect } from "react";

const ProtectedRoute = ({
  intendedRole,
  children,
}: {
  intendedRole: Roles;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { setRole } = useRole();

  const checkSession = async () => {
    try {
      const session = await authClient.getSession();
      const role = session.data?.user.role;

      if (!session || !role || role !== intendedRole) {
        router.replace("/error?msg=unauthorized");
        return;
      }

      setRole(intendedRole);
    } catch (error) {
      console.error("Error message: " + error);
      router.replace("/error?msg=unauthorized");
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return <>{children}</>;
};

export default ProtectedRoute;
