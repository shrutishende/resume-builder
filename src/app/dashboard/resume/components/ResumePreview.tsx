import { ResumeInfoContext } from "@/app/context/ResumeInfoContext";
import React, { useContext } from "react";
import PersonelDetailPreview from "./preview/PersonelDetailPreview";
import ExperiencePreview from "./preview/ExperiencePreview";
import EducationPreview from "./preview/EducationPreview";
import SkillsPreview from "./preview/SkillsPreview";
import SummeryPreview from "./preview/SummeryPreview";

type Props = {};

function ResumePreview({}: Props) {
    const { resumeInfo } = useContext(ResumeInfoContext);

    return (
        <div
            className="shadow-lg h-full p-14 border-t-[20px]"
            style={{
                borderColor: resumeInfo?.themeColor,
            }}
        >
            <PersonelDetailPreview resumeInfo={resumeInfo} />

            <SummeryPreview />

            <SkillsPreview />

            <ExperiencePreview />

            <EducationPreview />
        </div>
    );
}

export default ResumePreview;
