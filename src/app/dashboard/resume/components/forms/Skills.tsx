import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useState } from "react";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { ResumeInfoContext } from "@/app/context/ResumeInfoContext";
import { client } from "../../[resumeid]/edit/page";
import { toast } from "sonner";

export default function Skills({ enabledNext }) {
    const { resumeInfo, setResumeInfo, resumeEntry, setResumeEntry } =
        useContext(ResumeInfoContext);

    const [skillsList, setSkillsList] = useState([
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
        //  setSkillsList((skillsList) => skillsList.slice(0, -1));
        async function deleteSkill() {
            const lastSkillElement = skillsList[skillsList.length - 1];
            console.log("last skill", lastSkillElement);

            if (lastSkillElement.id) {
                const space = await client.getSpace(
                    process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
                );

                const environment = await space.getEnvironment("master");

                const entryToDelete = await environment.getEntry(
                    lastSkillElement.id
                );

                await entryToDelete.unpublish(); // Unpublish if published
                await entryToDelete.delete();

                console.log("entry to delete", entryToDelete);
            }

            
        }
        deleteSkill();
    };
    console.log("skill list", skillsList);
    console.log("resume info", resumeInfo);
    console.log("resume entry", resumeEntry);

    const handleChange = (index, name, value) => {
        const newEntries = skillsList.slice();
        newEntries[index][name] = value;

        setSkillsList(newEntries);

        setResumeInfo({
            ...resumeInfo,
            skills: skillsList,
        });
    };

    const onSave = async (e: React.FormEvent<HTMLFormElement>) => {
        const space = await client.getSpace(
            process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
        );

        const environment = await space.getEnvironment("master");
        e.preventDefault();

      //  setLoading(true);

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
        setResumeInfo({
            ...resumeInfo,
            skills: skillsList,
        });
       // enabledNext(true);
       // setLoading(false);
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
                    <>
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
                                        handleChange(
                                            index,
                                            "name",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <Rating
                                style={{ maxWidth: 120 }}
                                value={item.rating}
                                onChange={(v) =>
                                    handleChange(index, "rating", v)
                                }
                            />
                        </div>
                    </>
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

                <Button disabled={loading} onClick={onSave}>
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
