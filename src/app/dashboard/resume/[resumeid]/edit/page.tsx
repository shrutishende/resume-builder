"use client";
import Header from "@/components/custom/Header";
import React, { useEffect, useState } from "react";
import FormSection from "../../components/FormSection";
import ResumePreview from "../../components/ResumePreview";
import {
    ResumeInfoContext,
    ResumeEntry,
    Skills,
} from "@/app/context/ResumeInfoContext";
import dummy from "@/app/data/dummy";
import { client } from "@/lib/contentful/client";

export default function EditResume({
    params,
}: {
    params: { resumeid: string };
}) {
    const [resumeInfo, setResumeInfo] = useState<null | ResumeEntry>(null);
    const [resumeEntry, setResumeEntry] = useState<any | null>(null);


    useEffect(() => {
        const getData = async () => {
            const space = await client.getSpace(
                process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
            );

            const environment = await space.getEnvironment("master");

            const entry = await environment.getEntries({
                content_type: "resume",
                "sys.id": params.resumeid,
            });

            setResumeEntry(entry.items[0]);

            let skillStore = [];

            if (entry.items[0].fields.skills) {
                const raw_skills = entry.items[0].fields.skills["en-US"];

                const skill_id_promise = raw_skills.map(async (id: any) => {
                    const skill_id = id.sys.id;

                    const skill_entry = await environment.getEntries({
                        content_type: "skills",
                        "sys.id": skill_id,
                    });

                    const skill: any = {};

                    skill.id = skill_id;
                    if (skill_entry.items[0].fields.skill) {
                        skill.name = skill_entry.items[0].fields.skill["en-US"];
                    }
                    if (skill_entry.items[0].fields.rating) {
                        skill.rating =
                            skill_entry.items[0].fields.rating["en-US"];
                    }

                    return skill;
                });

                const skills = await Promise.all(skill_id_promise);
                skillStore = skills;
            }

            let educationStore = [];

            if (entry.items[0].fields.education) {
                const raw_education = entry.items[0].fields.education["en-US"];

                const education_id_promise = raw_education.map(
                    async (id: any) => {
                        const education_id = id.sys.id;

                        const education_entry = await environment.getEntries({
                            content_type: "education",
                            "sys.id": education_id,
                        });

                        const education: any = {};

                        education.id = education_id;

                        if (education_entry.items[0].fields.universityName) {
                            education.universityName =
                                education_entry.items[0].fields.universityName[
                                    "en-US"
                                ];
                        }
                        if (education_entry.items[0].fields.degree) {
                            education.degree =
                                education_entry.items[0].fields.degree["en-US"];
                        }

                        if (education_entry.items[0].fields.major) {
                            education.major =
                                education_entry.items[0].fields.major["en-US"];
                        }

                        if (education_entry.items[0].fields.startDate) {
                            education.startDate =
                                education_entry.items[0].fields.startDate[
                                    "en-US"
                                ];
                        }

                        if (education_entry.items[0].fields.endDate) {
                            education.endDate =
                                education_entry.items[0].fields.endDate[
                                    "en-US"
                                ];
                        }

                        if (education_entry.items[0].fields.description) {
                            education.description =
                                education_entry.items[0].fields.description[
                                    "en-US"
                                ];
                        }

                        return education;
                    }
                );

                const education = await Promise.all(education_id_promise);
                educationStore = education;
            }

        

            let experienceStore = [];

            if (entry.items[0].fields.experience) {
                const raw_experience =
                    entry.items[0].fields.experience["en-US"];

                const experience_id_promise = raw_experience.map(
                    async (id: any) => {
                        const experience_id = id.sys.id;

                        const experience_entry = await environment.getEntries({
                            content_type: "experience",
                            "sys.id": experience_id,
                        });

                        const experience: any = {};

                        experience.id = experience_id;
                        experience.city =
                            experience_entry.items[0].fields.city["en-US"];
                        experience.companyName =
                            experience_entry.items[0].fields.companyName[
                                "en-US"
                            ];
                        experience.state =
                            experience_entry.items[0].fields.state["en-US"];
                        experience.title =
                            experience_entry.items[0].fields.title["en-US"];
                        experience.workSummary =
                            experience_entry.items[0].fields.workSummary[
                                "en-US"
                            ];
                        if (experience_entry.items[0].fields.startDate) {
                            experience.startDate =
                                experience_entry.items[0].fields.startDate[
                                    "en-US"
                                ];
                        }
                        if (experience_entry.items[0].fields.endDate) {
                            experience.endDate =
                                experience_entry.items[0].fields.endDate[
                                    "en-US"
                                ];
                        }

                        return experience;
                    }
                );
                const experience = await Promise.all(experience_id_promise);
                experienceStore = experience;
            }
            let firstName;
            if (entry.items[0].fields.firstName) {
                const firstname = entry.items[0].fields.firstName["en-US"];
                firstName = firstname;
            }

            let lastName;
            if (entry.items[0].fields.lastName) {
                const lastname = entry.items[0].fields.lastName["en-US"];
                lastName = lastname;
            }

            let jobTitle;
            if (entry.items[0].fields.title) {
                const jobtitle = entry.items[0].fields.title["en-US"];
                jobTitle = jobtitle;
            }

            let address;
            if (entry.items[0].fields.address) {
                const Address = entry.items[0].fields.address["en-US"];
                address = Address;
            }

            let phone;
            if (entry.items[0].fields.phone) {
                const Phone = entry.items[0].fields.phone["en-US"];
                phone = Phone;
            }

            let email;
            if (entry.items[0].fields.email) {
                const Email = entry.items[0].fields.email["en-US"];
                email = Email;
            }

            let summary;
            if (entry.items[0].fields.summery) {
                const Summary = entry.items[0].fields.summery["en-US"];
                summary = Summary;
            }

            setResumeInfo({
                ...dummy,
                firstName: firstName,
                lastName: lastName,
                jobTitle: jobTitle,
                address: address,
                phone: phone,
                email: email,
                summary: summary,
                skills: skillStore,
                experience: experienceStore,
                education: educationStore,
            });
        };
        getData();
    }, []);

    return (
        <>
            <ResumeInfoContext.Provider
                value={{
                    resumeInfo,
                    setResumeInfo,
                    resumeEntry,
                    setResumeEntry,
                }}
            >
                <Header />
                <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10">
                    <FormSection />

                    <ResumePreview />
                </div>
            </ResumeInfoContext.Provider>
        </>
    );
}
