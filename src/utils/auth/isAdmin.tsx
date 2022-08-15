import { Session } from "next-auth";

export default function isAdmin(session: Session | null | undefined) {
  return session && session.user && session.user.role === "admin";
}
