import { ResumeInfoContext, ResumeInfoContextType } from "@/app/context/ResumeInfoContext";
import React, { useContext } from "react";


export default function SummeryPreview() {
    const { resumeInfo } = useContext(
        ResumeInfoContext
    ) as ResumeInfoContextType;
      //  useContext(ResumeInfoContext);
    return (
        <>
            <p className="text-xs">{resumeInfo?.summary}</p>
        </>
        
    );
}
