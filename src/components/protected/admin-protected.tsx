"use server";

import { getCurrentRole } from "@/lib/auth";
import { DEFAULT_DASHBOARD_REDIRECT } from "@routes";
import { redirect } from "next/navigation";

export async function AdminProtected() {
  const userRole = await getCurrentRole();
  if (userRole != "ADMIN") {
    redirect(DEFAULT_DASHBOARD_REDIRECT);
  }
  return <div></div>;
}
