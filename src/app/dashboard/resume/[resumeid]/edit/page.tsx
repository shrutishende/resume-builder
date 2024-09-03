"use client";
import Header from "@/components/custom/Header";
import React, { useEffect, useState } from "react";
import FormSection from "../../components/FormSection";
import ResumePreview from "../../components/ResumePreview";
import { ResumeInfoContext } from "@/app/context/ResumeInfoContext";
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
    const [resumeInfo, setResumeInfo] = useState();

    useEffect(() => {
        console.log("setting dummy");

            setResumeInfo(dummy)
    }, []);

    return (
        <>
            <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
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
