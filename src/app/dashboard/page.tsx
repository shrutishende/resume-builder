"use client";
import Header from "@/components/custom/Header";
import React, { useEffect, useState } from "react";
import AddResume from "./components/AddResume";
import { useUser } from "@clerk/nextjs";
import ResumeCardItem from "./components/ResumeCardItem";
import { client } from "@/lib/contentful/client";
//import { client } from "../../../service/Client"

export default function Dashboard() {
    const { user } = useUser();

    const emailID = user?.primaryEmailAddress?.emailAddress;
    const userID = user?.id;

    const [resumeList, setResumeList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchEntries() {
            setIsLoading(true);

            const space = await client.getSpace(
                process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
            );
            const environment = await space.getEnvironment("master");
            try {
                const res = await environment.getEntries({
                    content_type: "resume",
                    "fields.userId": userID,
                    order: "-sys.createdAt",
                });

                setResumeList(res.items);
            } catch (error) {
                console.error("Error fetching entries:", error);
            } finally {
                setIsLoading(false);
            }
        }

        if (userID) {
            fetchEntries();
        }
    }, [userID]);

    if (!userID) {
        <p>Loading</p>;
    }

 //  console.log("resume list", resumeList);

    return (
        <>
            <Header />
            <div className="p-10 md:px-20 lg:px-32">
                <h2 className="font-bold text-3xl">My Resume</h2>
                <p>Start creating resume to your next job role </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-10 gap-5">
                    <AddResume />
                    {isLoading ? (
                        <p>Loading</p>
                    ) : (
                        resumeList.length > 0 &&
                        resumeList.map((resume, index) => (
                            <ResumeCardItem
                                resume={resume}
                                key={index}
                               // resumeList= {resumeList}
                            />
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
