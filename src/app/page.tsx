"use client";
import Header from "@/components/custom/Header";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { AtomIcon, Edit, Share2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
    // const { user, isLoaded, isSignedIn } = useUser();
    // if (!isSignedIn && isLoaded) {
    //     return redirect("/auth/sign-in");
    // }

    const { user, isSignedIn } = useUser();
    return (
        <>
            <Header />

            <section className=" z-50">
                <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-14 lg:px-12">
                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                        Build Your Resume{" "}
                        <span className="text-primary">With AI</span>{" "}
                    </h1>
                    <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
                        Effortlessly Craft a Standout Resume with Our AI-Powered
                        Builder
                    </p>
                    <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                        {/* {isSignedIn ? (
                            <div className="flex gap-2 items-center">
                                <Link href="/dashboard">
                                    <Button variant="outline">
                                        {" "}
                                        Dashboard
                                    </Button>
                                </Link>

                                <UserButton />
                            </div>
                        ) : (
                            <Link href="/auth/sign-in">
                                <Button className="px-10 py-6 text-lg">Get Started</Button>
                            </Link>
                        )} */}

                        <Link href="/auth/sign-in">
                            <Button className="px-10 py-6 text-lg">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
            <section className="py-4 bg-white z-50 px-4 mx-auto max-w-screen-xl text-center lg:py-6 lg:px-12">
                <h2 className="font-bold text-3xl">
                    Create a resume that gets results
                </h2>

                <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <a
                        className="block rounded-xl border bg-white
         border-gray-200 p-8 shadow-xl transition
         hover:border-pink-500/10 hover:shadow-pink-500/10"
                        href="#"
                    >
                        <AtomIcon className="h-8 w-8" />

                        <h2 className="mt-4 text-xl font-bold text-black">
                            Recruiter-Approved Resume
                        </h2>

                        <p className="mt-1 text-sm text-gray-600">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Ex ut quo possimus adipisci distinctio alias
                            voluptatum blanditiis laudantium.
                        </p>
                    </a>

                    <a
                        className="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
                        href="#"
                    >
                        <Edit className="h-8 w-8" />

                        <h2 className="mt-4 text-xl font-bold text-black">
                            Finish Your Resume in 15 Minutes
                        </h2>

                        <p className="mt-1 text-sm text-gray-600">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Ex ut quo possimus adipisci distinctio alias
                            voluptatum blanditiis laudantium.
                        </p>
                    </a>

                    <a
                        className="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
                        href="#"
                    >
                        <Share2 className="h-8 w-8" />

                        <h2 className="mt-4 text-xl font-bold text-black">
                            Land an Interview
                        </h2>

                        <p className="mt-1 text-sm text-gray-600">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Ex ut quo possimus adipisci distinctio alias
                            voluptatum blanditiis laudantium.
                        </p>
                    </a>
                </div>
            </section>
        </>
    );
}
