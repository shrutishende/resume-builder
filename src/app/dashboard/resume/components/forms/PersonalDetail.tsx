import {
    ResumeInfoContext,
    ResumeInfoContextType,
} from "@/app/context/ResumeInfoContext";
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

export default function PersonalDetail({ enabledNext }: PersonalDetailProps) {
    const { resumeInfo, setResumeInfo, resumeEntry, setResumeEntry } =
        useContext(ResumeInfoContext) as ResumeInfoContextType;

    const [formData, setFormData] = useState<FormData>({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        enabledNext(false);
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        if (resumeInfo) {
            setResumeInfo({
                ...resumeInfo,
                [name]: value,
            });
        }
    };

    useEffect(() => {
        setFormData({
            firstName: resumeInfo?.firstName,
            lastName: resumeInfo?.lastName,
            jobTitle: resumeInfo?.jobTitle,
            address: resumeInfo?.address,
            phone: resumeInfo?.phone,
            email: resumeInfo?.email,
        });
    }, [resumeInfo]);

    const onSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        const data = {
            data: formData,
        };

        resumeEntry.fields.firstName = {
            "en-US": data.data.firstName,
        };
        resumeEntry.fields.lastName = {
            "en-US": data.data.lastName,
        };

        resumeEntry.fields.address = {
            "en-US": data.data.address,
        };

        resumeEntry.fields.email = {
            "en-US": data.data.email,
        };

        resumeEntry.fields.title = {
            "en-US": data.data.jobTitle,
        };

        resumeEntry.fields.phone = {
            "en-US": data.data.phone,
        };

        const update = await resumeEntry.update();

        const publish = await update.publish();

        setResumeEntry(publish);

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
