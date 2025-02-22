"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, User } from "lucide-react";
import { sendGAEvent } from "@/lib/analytics";

export default function ProfileDropdown() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  function handleSignIn(): void {
    sendGAEvent("login", "User Interaction", "Login", undefined);
    signIn();
  }

  function handleSignOut(): void {
    sendGAEvent("logout", "User Interaction", "Logout", undefined);
    signOut();
  }
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative h-10 w-10 rounded-full bg-primary/10 shadow-md">
          {status === "loading" ? (
            <Loader2 className="h-10 w-10 rounded-full animate-spin text-primary" />
          ) : (
            <Avatar className="relative h-10 w-10">
              {session?.user?.image ? (
                <>
                  <AvatarImage
                    src={session.user.image}
                    alt={session.user.name || ""}
                    onLoad={handleImageLoad}
                    className={imageLoaded ? "opacity-100" : "opacity-0"}
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  )}
                </>
              ) : (
                <AvatarFallback className="bg-transparent">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              )}
            </Avatar>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {status === "loading" ? (
          <DropdownMenuLabel>
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-3 w-[150px] mt-1" />
          </DropdownMenuLabel>
        ) : status === "authenticated" ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{session.user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
              Log out
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem className="cursor-pointer" onClick={handleSignIn}>
            Log in
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
