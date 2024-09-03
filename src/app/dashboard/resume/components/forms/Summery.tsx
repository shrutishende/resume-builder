import { ResumeInfoContext } from "@/app/context/ResumeInfoContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, SparklesIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { AIChatSession } from "../../../../../../service/AImodal";

interface SummaryProps {
    enabledNext: (value: boolean) => void;
}

interface SummaryItem {
    summary: string;
    experience_level: string;
}

const contentfulManagement = require("contentful-management");

export const client = contentfulManagement.createClient({
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

const prompt =
    "Job title: {jobTitle}, Depends on job title give me summery for my resume within 4-5 lines in JSON format with field experience level and summery with experience level for fresher, mid-level and experinced field in json format. And json format should be {[{'experience_level': 'fresher', 'summary' : 'sumarry value'}]}";

export default function Summery({ enabledNext }: SummaryProps) {
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

    const [loading, setLoading] = useState(false);

    const [summery, setSummery] = useState("");

    const params = useParams();

    const [aiGeneratedSummeryList, setAiGeneratedSummeryList] = useState<
        SummaryItem[] | null
    >(null);

    useEffect(() => {
        summery &&
            setResumeInfo({
                ...resumeInfo,
                summery: summery,
            });
    }, [summery]);

    const GenerateSummeryFromAI = async () => {
        setLoading(true);
        const PROMPT = prompt.replace("{jobTitle}", resumeInfo?.jobTitle);
        console.log(PROMPT);
        const result = await AIChatSession.sendMessage(PROMPT);

        setAiGeneratedSummeryList(JSON.parse(result.response.text()));
        setLoading(false);
    };

    const onSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        const data = {
            summery: summery,
        };

        const space = await client.getSpace(
            process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
        );

        const environment = await space.getEnvironment("master");

        const entry = await environment.getEntry(params.resumeid);

        entry.fields.summery = {
            "en-US": data.summery,
        };

        const updatedEntry = await entry.update();

        await updatedEntry.publish();

        enabledNext(true);
        setLoading(false);
        toast("Details Updated.");
    };

    return (
        <>
            <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
                <h2 className="font-bold text-lg">Summery</h2>
                <p>Add summery to your job title </p>{" "}
                <form className="mt-7" onSubmit={onSave}>
                    <div className="flex justify-between items-end">
                        <label>Add Summery</label>
                        <Button
                            className="border-primary text-primary flex gap-2"
                            size="sm"
                            variant="outline"
                            type="button"
                            onClick={() => GenerateSummeryFromAI()}
                        >
                            <SparklesIcon className="h-5 w-5" />
                            Generate from AI
                        </Button>
                    </div>
                    <Textarea
                        className="mt-5"
                        value={summery}
                        required
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            setSummery(e.target.value)
                        }
                    />

                    <div className="mt-2 flex justify-end">
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

            {aiGeneratedSummeryList && (
                <div>
                    <h2 className="font-bold text-lg">Suggestions</h2>
                    {aiGeneratedSummeryList?.map((item, index: number) => (
                        <div
                            key={index}
                            className="p-5 shadow-lg my-4 rounded-lg cursor-pointer"
                            onClick={() => setSummery(item?.summary)}
                        >
                            <h2 className="font-bold my-1 text-primary">
                                Level : {item?.experience_level}
                            </h2>
                            <p>{item?.summary}</p>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
