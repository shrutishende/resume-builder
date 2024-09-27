"use client";
import Header from "@/components/custom/Header";
import React, { useEffect, useState } from "react";
import FormSection from "../../components/FormSection";
import ResumePreview from "../../components/ResumePreview";
import {
    ResumeInfoContext,
    ResumeEntry,
    Skills,
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
    const [resumeEntry, setResumeEntry] = useState<any | null>(null);

    useEffect(() => {
        const getData = async () => {
            const space = await client.getSpace(
                process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
            );

            const environment = await space.getEnvironment("master");

            const entry = await environment.getEntries({
                content_type: "resume",
                "sys.id": params.resumeid,
            });

            setResumeEntry(entry.items[0]);

            let skillStore = []

            if (entry.items[0].fields.skills) {
                const raw_skills = entry.items[0].fields.skills["en-US"];

                const skill_id_promise = raw_skills.map(async (id: any) => {
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
                skillStore= skills
            }
                console.log("skill store", skillStore)

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
                skills: skillStore
            });
        };
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
                    <FormSection />

                    <ResumePreview />
                </div>
            </ResumeInfoContext.Provider>
        </>
    );
}
