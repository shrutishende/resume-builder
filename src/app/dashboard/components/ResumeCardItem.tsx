import { Notebook } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function ResumeCardItem(resume: any) {
    const resumeId = resume.resume.sys.id;

    return (
        <div>
            <Link href={`/dashboard/resume/${resumeId}/edit`}>
                <div
                    className="p-14  bg-gradient-to-b
          from-pink-100 via-purple-200 to-blue-200
        h-[280px] 
          rounded-t-lg border-t-4   border border-primary rounded-lg hover:scale-105 transition-all hover:shadow-md shadow-primary
        "
                    style={{
                        borderColor: "shadow-primary",
                    }}
                >
                    <div
                        className="flex 
        items-center justify-center h-[180px]   "
                    >
                        <Notebook />
                    </div>
                </div>
                <h2 className="text-center my-1">
                    {resume.resume.fields.title["en-US"]}
                </h2>
            </Link>
        </div>
    );
}
