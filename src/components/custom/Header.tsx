"use client"
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

type Props = {};

export default function Header({}: Props) {
    const { user, isSignedIn } = useUser();
    return (
        <div className="p-3 px-5 flex justify-between shadow-md">
            <Image src="/logo.svg" alt="logo" width={100} height={100} />

            {isSignedIn ? (
                <div className="flex gap-2 items-center">
                    <Link href="/dashboard">
                        <Button variant="outline"> Dashboard</Button>
                    </Link>

                    <UserButton />
                </div>
            ) : (
                <Link href="/auth/sign-in">
                    <Button>Get Started</Button>
                </Link>
            )}
        </div>
    );
}
