"use client";
import Header from "@/components/custom/Header";
import React, { useEffect, useState } from "react";
import FormSection from "../../components/FormSection";
import ResumePreview from "../../components/ResumePreview";
import {
    ResumeInfoContext,
    ResumeEntry,
} from "@/app/context/ResumeInfoContext";
import dummy from "@/app/data/dummy";

const contentfulManagement = require("contentful-management");

export const client = contentfulManagement.createClient({
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

export default function EditResume({
    params,
}: {
    params: { resumeid: string };
}) {
    const [resumeInfo, setResumeInfo] = useState<null | ResumeEntry>(null);
    const [resumeEntry, setResumeEntry] = useState();

    useEffect(() => {
        const getData = async () => {
            //  setResumeInfo(dummy);

            const space = await client.getSpace(
                process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
            );

            const environment = await space.getEnvironment("master");

            const entry = await environment.getEntries({
                content_type: "resume",
                "sys.id": params.resumeid,
            });

            console.log("entry",entry)

            setResumeEntry(entry.items[0]);

            const firstName = entry.items[0].fields.firstName["en-US"];
            const lastName = entry.items[0].fields.lastName["en-US"];
            const jobTitle = entry.items[0].fields.title["en-US"];
            const address = entry.items[0].fields.address["en-US"];
            const phone = entry.items[0].fields.phone["en-US"];
            const email = entry.items[0].fields.email["en-US"];
            const summary = entry.items[0].fields.summery["en-US"]

            setResumeInfo({
                ...dummy,
                firstName: firstName,
                lastName: lastName,
                jobTitle: jobTitle,
                address: address,
                phone: phone,
                email: email,
                summary:summary
            });


            //     const updatedResumeInfo: ResumeEntry = {
            //         firstName: entry.items[0].fields.firstName["en-US"],
            //         lastName: entry.items[0].fields.lastName["en-US"],
            //         jobTitle: entry.items[0].fields.title["en-US"],
            //         address: entry.items[0].fields.address["en-US"],
            //         phone: entry.items[0].fields.phone["en-US"],
            //         email: entry.items[0].fields.email["en-US"],
            //         themeColor: "",
            //         summary: "",
            //         experience: [],
            //         education: [],
            //         skills: []
            //     };
            //     setResumeInfo(updatedResumeInfo);
            // }
        }
        getData();
    }, []);

    return (
        <>
            <ResumeInfoContext.Provider
                value={{
                    resumeInfo,
                    setResumeInfo,
                    resumeEntry,
                    setResumeEntry,
                }}
            >
                <Header />
                <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10">
                    {/* Form Section */}
                    <FormSection />

                    {/* Preview Section */}
                    <ResumePreview />
                </div>
            </ResumeInfoContext.Provider>
        </>
    );
}
