import { Notebook } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function ResumeCardItem(resume: any) {
    const resumeId = resume.resume.sys.id;

    return (
        <Link href={`/dashboard/resume/${resumeId}/edit`}>
            <div>
                <div className="p-14 bg-secondary flex items-center justify-center h-[280px] border border-primary rounded-lg hover:scale-105 transition-all hover:shadow-md shadow-primary">
                    <Notebook />
                </div>
                <h2 className="text-center my-1">
                    {resume.resume.fields.title["en-US"]}
                </h2>
            </div>
        </Link>
    );
}
