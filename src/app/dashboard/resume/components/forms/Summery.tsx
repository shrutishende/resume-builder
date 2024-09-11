import { ResumeInfoContext } from "@/app/context/ResumeInfoContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, SparklesIcon } from "lucide-react";
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

const prompt =
    "Job title: {jobTitle}, Depends on job title give me summery for my resume within 4-5 lines in JSON format with field experience level and summery with experience level for fresher, mid-level and experinced field in json format. And json format should be {[{'experience_level': 'fresher', 'summary' : 'sumarry value'}]}";

export default function Summery({ enabledNext }: SummaryProps) {
    const { resumeInfo, setResumeInfo, resumeEntry, setResumeEntry } =
        useContext(ResumeInfoContext);

    const [loading, setLoading] = useState(false);

    const [summary, setSummary] = useState("");

    const [aiGeneratedSummeryList, setAiGeneratedSummeryList] = useState<
        SummaryItem[] | null
    >(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSummary(e.target.value);
        setResumeInfo({
            ...resumeInfo,
            summary: e.target.value,
        });
    };
    useEffect(() => {
        summary &&
            setResumeInfo({
                ...resumeInfo,
                summary: summary,
            });

        setSummary(resumeInfo?.summary);
    }, []);

    const GenerateSummeryFromAI = async () => {
        setLoading(true);
        const PROMPT = prompt.replace("{jobTitle}", resumeInfo?.jobTitle);

        const result = await AIChatSession.sendMessage(PROMPT);

        setAiGeneratedSummeryList(JSON.parse(result.response.text()));
        setLoading(false);
    };

    const onSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        const data = {
            summary: summary,
        };

        resumeEntry.fields.summery = {
            "en-US": data.summary,
        };

        const updatedEntry = await resumeEntry.update();

        const publish = await updatedEntry.publish();
        setResumeEntry(publish);

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
                        value={summary}
                        required
                        onChange={handleInputChange}
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
                            onClick={() => {
                                setSummary(item?.summary);
                                setResumeInfo({
                                    ...resumeInfo,
                                    summary: item?.summary,
                                });
                            }}
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
