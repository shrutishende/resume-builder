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

            setResumeEntry(entry.items[0]);

            const raw_skills = entry.items[0].fields.skills["en-US"];

            const skill_id_promise = raw_skills.map(async (id) => {
                const skill_id = id.sys.id;

                const skill_entry = await environment.getEntries({
                    content_type: "skills",
                    "sys.id": skill_id,
                });

                const skill = {
                    id: skill_id,
                    name: skill_entry.items[0].fields.skill["en-US"],
                    rating: skill_entry.items[0].fields.rating["en-US"],
                };
                return skill;
            });

            const skills = await Promise.all(skill_id_promise);

            const firstName = entry.items[0].fields.firstName["en-US"];
            const lastName = entry.items[0].fields.lastName["en-US"];
            const jobTitle = entry.items[0].fields.title["en-US"];
            const address = entry.items[0].fields.address["en-US"];
            const phone = entry.items[0].fields.phone["en-US"];
            const email = entry.items[0].fields.email["en-US"];
            const summary = entry.items[0].fields.summery["en-US"];

            setResumeInfo({
                ...dummy,
                firstName: firstName,
                lastName: lastName,
                jobTitle: jobTitle,
                address: address,
                phone: phone,
                email: email,
                summary: summary,
                skills: skills,
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
        };
        getData();
    }, []);

    //  console.log("resume info", resumeInfo);

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
