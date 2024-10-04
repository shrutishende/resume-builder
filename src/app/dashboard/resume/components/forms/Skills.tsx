import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useState } from "react";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import {
    ResumeInfoContext,
    ResumeInfoContextType,
} from "@/app/context/ResumeInfoContext";

import { toast } from "sonner";
import { client } from "@/lib/contentful/client";

interface SkillsProps {
    enabledNext: (value: boolean) => void;
}

interface Skills {
    id?: string;
    name: string;
    rating: number;
    [key: string]: any;
}

export default function Skills({ enabledNext }: SkillsProps) {
    const { resumeInfo, setResumeInfo, resumeEntry, setResumeEntry } =
        useContext(ResumeInfoContext) as ResumeInfoContextType;

    
    
    const [skillsList, setSkillsList] = useState<Skills[]>([
        {
            name: "",
            rating: 0,
        },
    ]);

    const [loading, setLoading] = useState(false);

    const AddNewSkills = () => {
        setSkillsList([
            ...skillsList,
            {
                name: "",
                rating: 0,
            },
        ]);
    };

    const RemoveSkills = async () => {
        setSkillsList((skillsList) => skillsList.slice(0, -1));
        const lastSkillElement = skillsList[skillsList.length - 1];

        if (lastSkillElement.id) {
            const space = await client.getSpace(
                process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
            );

            const environment = await space.getEnvironment("master");

             const updatedResumeEntry = await environment.getEntry(
                 resumeEntry.sys.id
             );

            updatedResumeEntry.fields.skills = {
                "en-US": updatedResumeEntry.fields.skills["en-US"].filter(
                    (skillRef: any) => skillRef.sys.id !== lastSkillElement.id
                ),
            };

            console.log("uppppppppp",updatedResumeEntry)

            const publishEntry = await updatedResumeEntry.update();

            await publishEntry.publish();

            const entryToDelete = await environment.getEntry(
                lastSkillElement.id
            );

            await entryToDelete.unpublish();
            await entryToDelete.delete();

            setResumeEntry(publishEntry);
        }
    };

    const handleChange = (index: number, name: string, value: any) => {
        const newEntries = skillsList.slice();
        newEntries[index][name] = value;

        setSkillsList(newEntries);

        if (resumeInfo) {
            setResumeInfo({
                ...resumeInfo,
                skills: skillsList,
            });
        }
    };

    const onSave = async () => {
        setLoading(true);

        const space = await client.getSpace(
            process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
        );

        const environment = await space.getEnvironment("master");

        for (let i = 0; i < skillsList.length; i++) {
            if (!skillsList[i].hasOwnProperty("id")) {
                const skillEntry = await environment.createEntry("skills", {
                    fields: {
                        skill: { "en-US": skillsList[i].name },
                        rating: { "en-US": skillsList[i].rating },
                    },
                });

                const skillID = skillEntry.sys.id;

                skillsList[i].id = skillID;

                await skillEntry.publish();
            } else {
                const skillEntry = await environment.getEntry(skillsList[i].id);

                skillEntry.fields.skill = { "en-US": skillsList[i].name };
                skillEntry.fields.rating = { "en-US": skillsList[i].rating };

                const updatedSkillEntry = await skillEntry.update();
                updatedSkillEntry.publish();
            }
        }
        const updatedResumeEntry = await environment.getEntry(
            resumeEntry.sys.id
        );

        updatedResumeEntry.fields.skills = {
            "en-US": skillsList.map((skill) => {
                return {
                    sys: {
                        id: skill.id,
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
                skills: skillsList,
            });
        }

        enabledNext(true);
        setLoading(false);
        toast("Details Updated.");
    };

    useEffect(() => {
        resumeInfo && setSkillsList(resumeInfo.skills);
    }, []);

    return (
        <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
            <h2 className="font-bold text-lg">Skills</h2>
            <p>Add your top professional key skills</p>

            <div>
                {skillsList.map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-between border rounded-lg p-3 mb-2"
                    >
                        <div>
                            <label className="text-xs">Name</label>
                            <Input
                                value={item.name}
                                className="w-full"
                                onChange={(e) =>
                                    handleChange(index, "name", e.target.value)
                                }
                            />
                        </div>
                        <Rating
                            style={{ maxWidth: 120 }}
                            value={item.rating}
                            onChange={(v: number) =>
                                handleChange(index, "rating", v)
                            }
                        />
                    </div>
                ))}
            </div>

            <div className="flex justify-between">
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="text-primary"
                        onClick={AddNewSkills}
                    >
                        {" "}
                        + Add more skills
                    </Button>

                    <Button
                        variant="outline"
                        className="text-primary"
                        onClick={RemoveSkills}
                    >
                        - Remove
                    </Button>
                </div>

                <Button disabled={loading} onClick={() => onSave()}>
                    {loading ? (
                        <LoaderCircle className="animate-spin" />
                    ) : (
                        "Save"
                    )}
                </Button>
            </div>
        </div>
    );
}
