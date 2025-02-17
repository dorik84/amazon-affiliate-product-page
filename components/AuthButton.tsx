"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function AuthButton() {
  const { data: session } = useSession();
  console.log(session);
  if (session) return <Button onClick={() => signOut()}> {session.user.name} Sign Out</Button>;
  else return <Button onClick={() => signIn()}>Sign In</Button>;
}
