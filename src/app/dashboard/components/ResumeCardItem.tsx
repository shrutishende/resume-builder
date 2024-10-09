"use client";
import { MoreVertical, Notebook } from "lucide-react";
import Link from "next/link";
import React, { useContext, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useRouter } from "next/navigation";
import { client } from "@/lib/contentful/client";
import { toast } from "sonner";
import {
    ResumeEntry,
    ResumeInfoContext,
} from "@/app/context/ResumeInfoContext";

export default function ResumeCardItem(resume: any) {
    const resumeId = resume.resume.sys.id;
    console.log("resume", resume);
    const router = useRouter();

    const [openAlert, setOpenAlert] = useState(false);

    const onDelete = async () => {
        const space = await client.getSpace(
            process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
        );

        const environment = await space.getEnvironment("master");

        const entry = await environment.getEntry(resumeId);
        console.log(entry);
        await entry.unpublish();
        await entry.delete();
        toast("resume deleted");
        //  refreshData();
        setOpenAlert(false);
    };
   // console.log("resume entry", resumeInfo);
    return (
        <div>
            <Link href={`/dashboard/resume/${resumeId}/edit`}>
                <div
                    className="p-14  bg-gradient-to-b
          from-pink-100 via-purple-200 to-blue-200
        h-[280px] 
          rounded-t-lg border-t-4   border border-primary rounded-lg hover:scale-105 transition-all hover:shadow-md shadow-primary
        "
                    style={{
                        borderColor: "shadow-primary",
                    }}
                >
                    <div
                        className="flex 
        items-center justify-center h-[180px]   "
                    >
                        <Notebook />
                    </div>
                </div>
            </Link>
            <div
                className="border
                    p-3
                    flex
                    justify-between
                 
                    rounded-b-lg
                    shadow-lg"
                style={{
                    background: resume?.themeColor,
                }}
            >
                <h2 className="text-center my-1">
                    {resume.resume.fields.title["en-US"]}
                </h2>

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() =>
                                router.push(
                                    `/dashboard/resume/${resumeId}/edit`
                                )
                            }
                        >
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                router.push(`/my-resume/` + resumeId + `/view`)
                            }
                        >
                            View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                router.push(`/my-resume/` + resumeId + `/view`)
                            }
                        >
                            Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOpenAlert(true)}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <AlertDialog open={openAlert}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={() => setOpenAlert(false)}
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={onDelete}>
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
