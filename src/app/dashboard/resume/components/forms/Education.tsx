import {
    ResumeInfoContext,
    ResumeInfoContextType,
} from "@/app/context/ResumeInfoContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { client } from "@/lib/contentful/client";
import { LoaderCircle } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface Education {
    id?: string;
    universityName: string;
    startDate: string;
    endDate: string;
    major: string;
    degree: string;
    description: string;
    [key: string]: any;
}


interface EducationList {
    id?: string;
    universityName: { "en-US": string | undefined };
    startDate?: { "en-US": string | undefined };
    endDate?: { "en-US": string | undefined };
    major: { "en-US": string | undefined };
    degree: { "en-US": string | undefined };
    description: { "en-US": string | undefined };
    [key: string]: any;
}



interface EducationProps {
    enabledNext: (value: boolean) => void;
}

export default function Education({ enabledNext }: EducationProps) {
    const { resumeInfo, setResumeInfo, resumeEntry, setResumeEntry } =
        useContext(ResumeInfoContext) as ResumeInfoContextType;

    const [educationList, setEducationList] = useState<Education[]>([
        {
            universityName: "",
            degree: "",
            major: "",
            startDate: "",
            endDate: "",
            description: "",
        },
    ]);

    const [loading, setLoading] = useState(false);

    const AddNewEducation = () => {
        setEducationList([
            ...educationList,
            {
                universityName: "",
                degree: "",
                major: "",
                startDate: "",
                endDate: "",
                description: "",
            },
        ]);
    };
    const RemoveEducation = async () => {
        setEducationList((educationList) => educationList.slice(0, -1));

        const lastEducationElement = educationList[educationList.length - 1];

        if (lastEducationElement.id) {
            const space = await client.getSpace(
                process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
            );

            const environment = await space.getEnvironment("master");

            const updatedResumeEntry = await environment.getEntry(
                resumeEntry.sys.id
            );

            updatedResumeEntry.fields.education = {
                "en-US": updatedResumeEntry.fields.education["en-US"].filter(
                    (educationRef: any) =>
                        educationRef.sys.id !== lastEducationElement.id
                ),
            };

            const publishEntry = await updatedResumeEntry.update();

            await publishEntry.publish();

            const entryToDelete = await environment.getEntry(
                lastEducationElement.id
            );

            await entryToDelete.unpublish();
            await entryToDelete.delete();

            setResumeEntry(publishEntry);
        }
    };
    const handleChange = (e: any, index: number) => {
        const newEntries = educationList.slice();
        const { name, value } = e.target;
        newEntries[index][name] = value;
        setEducationList(newEntries);

        if (resumeInfo) {
            setResumeInfo({
                ...resumeInfo,
                education: educationList,
            });
        }
    };

    const onSave = async () => {
        setLoading(true);
        const space = await client.getSpace(
            process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
        );
        const environment = await space.getEnvironment("master");

        for (let i = 0; i < educationList.length; i++) {
            const education:EducationList = {
                universityName: { "en-US": educationList[i].universityName },
                degree: { "en-US": educationList[i].degree },
                major: { "en-US": educationList[i].major },
                description: { "en-US": educationList[i].description },
            };

            if (educationList[i].startDate) {
                education.startDate = {
                    "en-US": educationList[i].startDate || "",
                };
            }

            if (educationList[i].endDate) {
                education.endDate = {
                    "en-US": educationList[i].endDate || "",
                };
            }

            if (!educationList[i].hasOwnProperty("id")) {
                const educationEntry = await environment.createEntry(
                    "education",
                    {
                        fields: education,
                    }
                );

                const educationID = educationEntry.sys.id;

                educationList[i].id = educationID;

                await educationEntry.publish();
            } else {
                const educationEntry = await environment.getEntry(
                    educationList[i].id
                );

                educationEntry.fields.universityName = {
                    "en-US": educationList[i].universityName,
                };

                educationEntry.fields.degree = {
                    "en-US": educationList[i].degree,
                };

                educationEntry.fields.major = {
                    "en-US": educationList[i].major,
                };

                educationEntry.fields.description = {
                    "en-US": educationList[i].description,
                };

                if (educationEntry.fields.startDate) {
                    educationEntry.fields.startDate = {
                        "en-US": educationList[i].startDate,
                    };
                }

                if (educationEntry.fields.endDate) {
                    educationEntry.fields.endDate = {
                        "en-US": educationList[i].endDate,
                    };
                }

                const updatedEducationEntry = await educationEntry.update();
                updatedEducationEntry.publish();
            }
        }

        const updatedResumeEntry = await environment.getEntry(
            resumeEntry.sys.id
        );

        updatedResumeEntry.fields.education = {
            "en-US": educationList.map((education) => {
                return {
                    sys: {
                        id: education.id,
                        linkType: "Entry",
                        type: "Link",
                    },
                };
            }),
        };

        const publishedEntry = await updatedResumeEntry.update();
        await publishedEntry.publish();

        setResumeEntry(publishedEntry);
        if (resumeInfo) {
            setResumeInfo({
                ...resumeInfo,
                education: educationList,
            });
        }

        enabledNext(true);
        setLoading(false);
        toast("Details Updated.");
    };

    useEffect(() => {
        resumeInfo && setEducationList(resumeInfo.education);
    }, []);

    return (
        <div>
            <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
                <h2 className="font-bold text-lg">Education</h2>
                <p>Add your Education Details </p>

                <div>
                    {educationList.map((item, index) => (
                        <div>
                            <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
                                <div>
                                    <label>University Name</label>
                                    <Input
                                        value={item.universityName}
                                        name="universityName"
                                        onChange={(e) => handleChange(e, index)}
                                    />
                                </div>

                                <div>
                                    <label>Degree</label>
                                    <Input
                                        value={item.degree}
                                        name="degree"
                                        onChange={(e) => handleChange(e, index)}
                                    />
                                </div>

                                <div>
                                    <label>Major</label>
                                    <Input
                                        value={item.major}
                                        name="major"
                                        onChange={(e) => handleChange(e, index)}
                                    />
                                </div>

                                <div>
                                    <label>Start Date</label>
                                    <Input
                                        value={item.startDate}
                                        type="date"
                                        name="startDate"
                                        onChange={(e) => handleChange(e, index)}
                                    />
                                </div>

                                <div>
                                    <label>End Date</label>
                                    <Input
                                        value={item.endDate}
                                        type="date"
                                        name="endDate"
                                        onChange={(e) => handleChange(e, index)}
                                    />
                                </div>

                                <div>
                                    <label>Description</label>
                                    <Textarea
                                        value={item.description}
                                        name="description"
                                        onChange={(e) => handleChange(e, index)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-between">
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="text-primary"
                                onClick={AddNewEducation}
                            >
                                {" "}
                                + Add more Education Details
                            </Button>
                            <Button
                                variant="outline"
                                className="text-primary"
                                onClick={RemoveEducation}
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
        </div>
    );
}
