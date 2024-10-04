import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useState } from "react";
import RichTextEditor from "../RichTextEditor";
import {
    ResumeInfoContext,
    ResumeInfoContextType,
} from "@/app/context/ResumeInfoContext";
import { LoaderCircle } from "lucide-react";
import { client } from "@/lib/contentful/client";
import { toast } from "sonner";

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
    currentlyWorking: false,
};

// interface Experience {
//     id?: string;
//     title: string;
//     companyName: string;
//     city: string;
//     state: string;
//     startDate: string;
//     endDate: string;
//     currentlyWorking: boolean;
//     workSummary: string;
//     [key: string]: any;
// }

export default function Experience({ enabledNext }: ExperienceProps) {
    const { resumeInfo, setResumeInfo, resumeEntry, setResumeEntry } =
        useContext(ResumeInfoContext) as ResumeInfoContextType;

    const [experienceList, setExperienceList] = useState([formField]);

    const [loading, setLoading] = useState(false);

    const handleChange = (index: number, event: any) => {
        const newEntries = experienceList.slice();
        const { name, value } = event.target;
        newEntries[index][name] = value;
        setExperienceList(newEntries);

        if (resumeInfo) {
            setResumeInfo({
                ...resumeInfo,
                experience: experienceList,
            });
        }
    };
    const AddNewExperience = () => {
        setExperienceList([
            ...experienceList,
            {
                title: "",
                companyName: "",
                city: "",
                state: "",
                startDate: "",
                endDate: "",
                workSummary: "",
                currentlyWorking: false,
            },
        ]);
    };
    const RemoveExperience = async () => {
        setExperienceList((experienceList) => experienceList.slice(0, -1));

        const lastExperienceElement = experienceList[experienceList.length - 1];

       

        if (lastExperienceElement.id) {
            const space = await client.getSpace(
                process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
            );

            const environment = await space.getEnvironment("master");


            const updatedResumeEntry = await environment.getEntry(
                resumeEntry.sys.id
            );

           

            updatedResumeEntry.fields.experience = {
                "en-US": updatedResumeEntry.fields.experience["en-US"].filter(
                    (experienceRef: any) =>
                        experienceRef.sys.id !== lastExperienceElement.id
                ),
            };

           

            const publishEntry = await updatedResumeEntry.update();

            await publishEntry.publish();

            const entryToDelete = await environment.getEntry(
                lastExperienceElement.id
            );

            await entryToDelete.unpublish();
            await entryToDelete.delete();

            setResumeEntry(publishEntry);
        }
    };

   

    const handleRichTextEditor = (e, name, index) => {
        const newEntries = experienceList.slice();
        newEntries[index][name] = e.target.value;
        setExperienceList(newEntries);

        if (resumeInfo) {
            setResumeInfo({
                ...resumeInfo,
                experience: experienceList,
            });
        }
    };

    const onSave = async () => {
        setLoading(true);
        const space = await client.getSpace(
            process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
        );
        const environment = await space.getEnvironment("master");

        for (let i = 0; i < experienceList.length; i++) {
            const experience = {
                title: { "en-US": experienceList[i].title },
                companyName: { "en-US": experienceList[i].companyName },
                city: { "en-US": experienceList[i].city },
                state: { "en-US": experienceList[i].state },
                workSummary: { "en-US": experienceList[i].workSummary },
            };

            if (experienceList[i].startDate) {
                console.log("here 2");
                experience.startDate = { "en-US": experienceList[i].startDate };
            }

            if (experienceList[i].endDate) {
                console.log("here 3");
                experience.endDate = { "en-US": experienceList[i].endDate };
            }

            //console.log("for lopp", experience);
            if (!experienceList[i].hasOwnProperty("id")) {
                console.log("experience here 1", experience);
                const experienceEntry = await environment.createEntry(
                    "experience",
                    {
                        fields: experience,
                    }
                );

                console.log("exp entry", experienceEntry);

                const experienceID = experienceEntry.sys.id;

                experienceList[i].id = experienceID;

                await experienceEntry.publish();
            } else {

                console.log("here 4")
                const experienceEntry = await environment.getEntry(
                    experienceList[i].id
                );

                experienceEntry.fields.title = {
                    "en-US": experienceList[i].title,
                };

                experienceEntry.fields.companyName = {
                    "en-US": experienceList[i].companyName,
                };

                experienceEntry.fields.city = {
                    "en-US": experienceList[i].city,
                };

                experienceEntry.fields.state = {
                    "en-US": experienceList[i].state,
                };


                if (experienceEntry.fields.startDate) {

                    experienceEntry.fields.startDate = {
                        "en-US": experienceList[i].startDate,
                    };
                }


                 if (experienceEntry.fields.endDate) {
                     experienceEntry.fields.endDate = {
                         "en-US": experienceList[i].endDate,
                     };
                 }
                

               
                experienceEntry.fields.workSummary = {
                    "en-US": experienceList[i].workSummary,
                };

                const updatedExperienceEntry = await experienceEntry.update();
                updatedExperienceEntry.publish();
            }
        }

        const updatedResumeEntry = await environment.getEntry(
            resumeEntry.sys.id
        );

        updatedResumeEntry.fields.experience = {
            "en-US": experienceList.map((experience) => {
                return {
                    sys: {
                        id: experience.id,
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
                experience: experienceList,
            });
        }

        enabledNext(true);
        setLoading(false);
        toast("Details Updated.");
    };
    useEffect(() => {
        resumeInfo && setExperienceList(resumeInfo.experience);
    }, []);
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
                                        value={item.title}
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
                                        value={item.companyName}
                                        name="companyName"
                                        onChange={(event) =>
                                            handleChange(index, event)
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="text-xs">City</label>
                                    <Input
                                        value={item.city}
                                        name="city"
                                        onChange={(event) =>
                                            handleChange(index, event)
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="text-xs">State</label>
                                    <Input
                                        value={item.state}
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
                                        value={item.startDate}
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
                                        value={item.endDate}
                                        name="endDate"
                                        type="date"
                                        onChange={(event) =>
                                            handleChange(index, event)
                                        }
                                    />
                                </div>
                                <div className="col-span-2">
                                    <RichTextEditor
                                        value={item.workSummary}
                                        index={index}
                                        onRichTextEditorChange={(event) => {
                                            handleRichTextEditor(
                                                event,
                                                "workSummary",
                                                index
                                            );
                                        }}
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
