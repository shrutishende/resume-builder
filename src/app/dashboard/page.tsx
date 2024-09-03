"use client";
import Header from "@/components/custom/Header";
import React, { useEffect, useState } from "react";
import AddResume from "./components/AddResume";
import { useUser } from "@clerk/nextjs";
import ResumeCardItem from "./components/ResumeCardItem";
const contentfulManagement = require("contentful-management");

export const client = contentfulManagement.createClient({
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

export default function Dashboard() {
    const { user } = useUser();
    console.log(user)

    const emailID = user?.primaryEmailAddress?.emailAddress;
    const userID= user?.id
    console.log(userID);
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
                console.log("here 1");
                const res = await environment.getEntries({
                    content_type: "resume",
                    "fields.userId": userID,
                    order: "-sys.createdAt",
                });
                console.log(res)
                setResumeList(res.items);
               console.log(res.items)
            } catch (error) {
                console.error("Error fetching entries:", error);
            } finally {
                setIsLoading(false); 
            }
        }
       // console.log("emailId", emailID)
        if (userID) {
            fetchEntries();
        }
    }, [userID]);

    if (!userID) {
        <p>Loading</p>;
    }

   // console.log("entries", resumeList);

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
                            />
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
