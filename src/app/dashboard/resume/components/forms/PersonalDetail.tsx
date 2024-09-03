import { ResumeInfoContext } from "@/app/context/ResumeInfoContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { useParams } from "next/navigation";
import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface FormData {
    firstName?: string;
    lastName?: string;
    jobTitle?: string;
    address?: string;
    phone?: string;
    email?: string;
}

interface PersonalDetailProps {
    enabledNext: (value: boolean) => void;
}

const contentfulManagement = require("contentful-management");

export const client = contentfulManagement.createClient({
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

export default function PersonalDetail({ enabledNext }: PersonalDetailProps) {
    const params = useParams();

    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    //  console.log(resumeInfo?.items[0].fields);
    const [formData, setFormData] = useState<FormData>({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log("handler");
        enabledNext(false);
        const { name, value } = e.target;
        console.log(name);
        console.log(value);

        setFormData({
            ...formData,
            [name]: value,
        });
        console.log(resumeInfo);
        setResumeInfo({
            ...resumeInfo,
            [name]: value,
        });
        console.log("111111");
        console.log(resumeInfo);
    };

    useEffect(() => {
        console.log("here 1");

        const getData = async () => {
            // const data = {
            //     data: formData,
            // };

            const space = await client.getSpace(
                process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
            );

            const environment = await space.getEnvironment("master");

            const entry = await environment.getEntries({
                content_type: "resume",
                "sys.id": params.resumeid,
            });

            //  console.log("entry", entry);

            const personalDetail = entry.items[0].fields;
            //    console.log("personal details ", personalDetail);

            if (personalDetail) {
                setFormData({
                    firstName: personalDetail.firstName["en-US"],
                    lastName: personalDetail.lastName["en-US"],
                    jobTitle: personalDetail.title["en-US"],
                    address: personalDetail.address["en-US"],
                    phone: personalDetail.phone["en-US"],
                    email: personalDetail.email["en-US"],
                });
            }
        };
        getData();
    }, []);

    //console.log("form data", formData);
    const onSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        const data = {
            data: formData,
        };

        const space = await client.getSpace(
            process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
        );

        const environment = await space.getEnvironment("master");

        const entry = await environment.getEntry(params.resumeid);

        //  console.log("personel on save", entry);

        entry.fields.email["en-US"] = data.data.email;

        entry.fields.firstName = {
            "en-US": data.data.firstName,
        };
        entry.fields.lastName = {
            "en-US": data.data.lastName,
        };
        entry.fields.address = {
            "en-US": data.data.address,
        };
        entry.fields.phone = {
            "en-US": data.data.phone,
        };

        entry.fields.title["en-US"] = data.data.jobTitle;

        const updatedEntry = await entry.update();

        await updatedEntry.publish();

        enabledNext(true);
        setLoading(false);
        toast("Details Updated.");
    };
    return (
        <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
            <h2 className="font-bold text-lg">Personal Detail</h2>
            <p>Get started with the basic information</p>
            <form onSubmit={onSave}>
                <div className="grid grid-cols-2 mt-5 gap-3">
                    <div>
                        <label className="text-sm"> First Name</label>
                        <Input
                            name="firstName"
                            onChange={handleInputChange}
                            defaultValue={formData?.firstName}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm"> Last Name</label>
                        <Input
                            name="lastName"
                            onChange={handleInputChange}
                            defaultValue={formData?.lastName}
                            required
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm"> Job Title</label>
                        <Input
                            name="jobTitle"
                            onChange={handleInputChange}
                            defaultValue={formData?.jobTitle}
                            required
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm"> Address</label>
                        <Input
                            name="address"
                            onChange={handleInputChange}
                            defaultValue={formData?.address}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm"> Phone</label>
                        <Input
                            name="phone"
                            onChange={handleInputChange}
                            defaultValue={formData?.phone}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm"> Email</label>
                        <Input
                            name="email"
                            onChange={handleInputChange}
                            defaultValue={formData?.email}
                            required
                        />
                    </div>
                </div>
                <div className="mt-3 flex justify-end">
                    <Button type="submit" disabled={loading}>
                        {loading ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            "Save"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
