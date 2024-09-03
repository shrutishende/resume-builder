import { ResumeInfoContext } from "@/app/context/ResumeInfoContext";
import React, { useContext } from "react";
import PersonelDetailPreview from "./preview/PersonelDetailPreview";
import ExperiencePreview from "./preview/ExperiencePreview";
import EducationPreview from "./preview/EducationPreview";
import SkillsPreview from "./preview/SkillsPreview";
import SummeryPreview from "./preview/SummeryPreview";

type Props = {};

function ResumePreview({}: Props) {
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
   // console.log(resumeInfo);

    return (
        <div
            className="shadow-lg h-full p-14 border-t-[20px]"
            style={{
                borderColor: resumeInfo?.themeColor,
            }}

           
        >
            {/* Personal Details */}
            <PersonelDetailPreview resumeInfo={resumeInfo} />

            <SummeryPreview resumeInfo={resumeInfo} />

            {/* professional experience */}
            <ExperiencePreview resumeInfo={resumeInfo} />

            {/* education */}
            <EducationPreview resumeInfo={resumeInfo} />

            {/* skills */}
            <SkillsPreview resumeInfo={resumeInfo} />
        </div>
    );
}

export default ResumePreview;
