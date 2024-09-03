"use client";
import React, { useState } from "react";
import { Loader2, PlusSquare } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
const contentfulManagement = require("contentful-management");


export const client = contentfulManagement.createClient({
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

export default function AddResume() {
    const [openDialog, setOpenDialog] = useState(false);
    const [resumeTitle, setResumeTitle] = useState();
    const { user } = useUser();
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const onCreate = async () => {
        setLoading(true);
        const uuid = uuidv4();
        // console.log("uuid", uuid);
        const data = {
            title: resumeTitle,
            id: uuid,
            email: user?.primaryEmailAddress?.emailAddress,
            username: user?.fullName,
            userId: user?.id,
        };

        console.log("data", data);
        const space = await client.getSpace(
            process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
        );

        const environment = await space.getEnvironment("master");

        const resumeEntry = await environment.createEntry("resume", {
            fields: {
                title: { "en-US": data.title },
                id: { "en-US": data.id },
                email: { "en-US": data.email },
                username: { "en-US": data.username },
                userId: { "en-US": data.userId },
            },
        });

        await resumeEntry.publish();
        console.log("resumeEntry", resumeEntry);

        setLoading(false);
        await router.push(`/dashboard/resume/${resumeEntry.sys.id}/edit`);
    };
    return (
        <div>
            <div
                className="p-14 py-24 border items-center flex justify-center bg-secondary rounded-lg 
             h-[280px] hover:scale-105 transition-all hover:shadow-md cursor-pointer border-dashed"
                onClick={() => setOpenDialog(true)}
            >
                <PlusSquare />
            </div>
            <Dialog open={openDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Resume</DialogTitle>
                        <DialogDescription>
                            Add title for your new resume
                            <Input
                                className="my-2"
                                placeholder="Ex. Full stack resume"
                                onChange={(e) => setResumeTitle(e.target.value)}
                            />
                        </DialogDescription>
                        <div className="flex justify-end gap-5">
                            <Button
                                variant="ghost"
                                onClick={() => setOpenDialog(false)}
                            >
                                Cancel
                            </Button>{" "}
                            <Button
                                disabled={!resumeTitle || loading}
                                onClick={() => onCreate()}
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    "Create"
                                )}
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}
