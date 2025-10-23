"use server";

import auth from "@/lib/auth-server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

const createCashier = async ({
  password,
  name,
  username,
}: {
  password: string;
  name: string;
  username: string;
}) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const data = await auth.api.signUpEmail({
    returnHeaders: true,
    body: {
      email: `${username}@placeholder.com`,
      password: password,
      name: name,
      username: username,
      admin_id: session.user.id,
    },
  });

  revalidatePath("/admin/users");

  return data;
};

export default createCashier;
