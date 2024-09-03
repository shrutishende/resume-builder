"use client";
import Header from "@/components/custom/Header";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {
    // const { user, isLoaded, isSignedIn } = useUser();
    // if (!isSignedIn && isLoaded) {
    //     return redirect("/auth/sign-in");
    // }
    return (
        <>
            <Header />
            <div>Landing Screen</div>
        </>
    );
}
