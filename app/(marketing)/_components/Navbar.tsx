"use client"
import useScrollTop from '@/hooks/use-scroll-top'
import { cn } from '@/lib/utils'
import React from 'react'
import Logo from './Logo'
import { ModeToggle } from '@/components/ModeToggle'
import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";
import Link from "next/link";

const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();
  return (
    <nav className={cn("fixed top-0 z-50 flex items-center backdrop-blur-sm transition-all w-full p-6 dark:bg-[#1F1F1F]", scrolled && "border-b shadow-sm")}>
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-6">
        {isLoading && <Spinner />}

        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode="modal">
              <Button variant={"ghost"} size={"sm"}>
                Login in
              </Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button  size={"sm"}>Get Jotion free</Button>
            </SignInButton>
          </>
        )}

        {isAuthenticated && !isLoading && (
          <>
            <Button variant={"ghost"} size={"sm"} asChild>
              <Link href="/documents">Enter Jotion</Link>
            </Button>
            <UserButton afterSwitchSessionUrl="/" />
          </>
        )}
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar