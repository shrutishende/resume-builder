import {
    ResumeInfoContext,
    ResumeInfoContextType,
} from "@/app/context/ResumeInfoContext";
import React, { useContext } from "react";

export default function SkillsPreview() {
    const { resumeInfo } = useContext(
        ResumeInfoContext
    ) as ResumeInfoContextType;
    //    useContext(ResumeInfoContext);
    console.log("resume info", resumeInfo);
    return (
        <div className="my-6">
            <h2
                className="text-center font-bold text-sm mb-2"
                style={{ color: "red" }}
            >
                Skills
            </h2>
            <hr style={{ borderColor: "red" }} />
            <div className="grid grid-cols-2 gap-3 my-4">
                {resumeInfo?.skills?.map((skill, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between"
                    >
                        <h2 className="text-xs ">{skill.name}</h2>
                        <div className="h-2 bg-gray-200 w-[120px]">
                            <div
                                className="h-2"
                                style={{
                                    backgroundColor: "gray",
                                    width: skill?.rating * 20 + "%",
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
