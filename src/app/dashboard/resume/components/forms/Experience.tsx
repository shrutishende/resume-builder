import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useState } from "react";
import RichTextEditor from "../RichTextEditor";
import { ResumeInfoContext } from "@/app/context/ResumeInfoContext";
import { useParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";

interface ExperienceProps {
    enabledNext: (value: boolean) => void;
}

const formField = {
    title: "",
    companyName: "",
    city: "",
    state: "",
    startDate: "",
    endDate: "",
    workSummary: "",
};

const contentfulManagement = require("contentful-management");

export const client = contentfulManagement.createClient({
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

export default function Experience({ enabledNext }: ExperienceProps) {
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

    const [experienceList, setExperienceList] = useState([formField]);
 const [loading, setLoading] = useState(false);
    const params = useParams();

    const handleChange = (index: any, event: any) => {
        const newEntries = experienceList.slice();
        const { name, value } = event.target;
        newEntries[index][name] = value;
        setExperienceList(newEntries);
    };

    const AddNewExperience = () => {
        setExperienceList([...experienceList, formField]);
    };

    const RemoveExperience = () => {
        setExperienceList((experienceList) => experienceList.slice(0, -1));
    };

    const handleRichTextEditor = (e, name, index) => {
        const newEntries = experienceList.slice();
        newEntries[index][name] = e.target.value;
        setExperienceList(newEntries);
    };

    const onSave = async (e) => {
        e.preventDefault();

        const data = {
            data: experienceList,
        };

        console.log("data", data.data[0].title);

        const space = await client.getSpace(
            process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
        );

        const environment = await space.getEnvironment("master");

        // const entry = await environment.getEntry(params.resumeid);

        const entry = await environment.createEntry("experience", {
            fields: {
                title: { "en-US": data.data[0].title },
                companyName: { "en-US": data.data[0].companyName },
                city: { "en-US": data.data[0].city },
                state: { "en-US": data.data[0].state },
                startDate: { "en-US": data.data[0].startDate },
                endDate: { "en-US": data.data[0].endDate },
                workSummary: { "en-US": data.data[0].workSummary },
            },
        });
        console.log("entry", entry);
    };

    useEffect(() => {
        setResumeInfo({
            ...resumeInfo,
            experience: experienceList,
        });
    }, [experienceList]);
    return (
        <div>
            <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
                <h2 className="font-bold text-lg">Professional Experience</h2>
                <p>Add your previous job experience </p>
                <div>
                    {experienceList.map((item, index) => (
                        <div key={index}>
                            <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
                                <div>
                                    <label className="text-xs">
                                        Position Title
                                    </label>
                                    <Input
                                        name="title"
                                        onChange={(event) =>
                                            handleChange(index, event)
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="text-xs">
                                        Company Name
                                    </label>
                                    <Input
                                        name="companyName"
                                        onChange={(event) =>
                                            handleChange(index, event)
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="text-xs">City</label>
                                    <Input
                                        name="city"
                                        onChange={(event) =>
                                            handleChange(index, event)
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="text-xs">State</label>
                                    <Input
                                        name="state"
                                        onChange={(event) =>
                                            handleChange(index, event)
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="text-xs">
                                        Start Date
                                    </label>
                                    <Input
                                        name="startDate"
                                        type="date"
                                        onChange={(event) =>
                                            handleChange(index, event)
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="text-xs">End Date</label>
                                    <Input
                                        name="endDate"
                                        type="date"
                                        onChange={(event) =>
                                            handleChange(index, event)
                                        }
                                    />
                                </div>
                                <div className="col-span-2">
                                    <RichTextEditor
                                        index={index}
                                        onRichTextEditorChange={(event) =>
                                            handleRichTextEditor(
                                                event,
                                                "workSummary",
                                                index
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="text-primary"
                            onClick={AddNewExperience}
                        >
                            {" "}
                            + Add more experience
                        </Button>

                        <Button
                            variant="outline"
                            className="text-primary"
                            onClick={RemoveExperience}
                        >
                            - Remove
                        </Button>
                    </div>

                    <Button disabled={loading} onClick={onSave}>
                        {loading ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            "Save"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
