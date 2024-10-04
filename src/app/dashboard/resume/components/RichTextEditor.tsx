import {
    ResumeInfoContext,
    ResumeInfoContextType,
} from "@/app/context/ResumeInfoContext";
import { Button } from "@/components/ui/button";
import { LoaderCircle, SparklesIcon } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import {
    BtnBold,
    BtnBulletList,
    BtnItalic,
    BtnLink,
    BtnNumberedList,
    BtnStrikeThrough,
    BtnUnderline,
    Editor,
    EditorProvider,
    Separator,
    Toolbar,
} from "react-simple-wysiwyg";
import { toast } from "sonner";
import { AIChatSession } from "../../../../../service/AImodal";

const PROMPT =
    "depends on given position title: {positionTitle}  give me response in json format and format should be like {summary : experience_summary } and experience summary value will be of html tags and should be in bullet points";

export default function RichTextEditor({
    onRichTextEditorChange,
    index,
    value,
}: any) {
    const [values, setValues] = useState(value);

    const { resumeInfo, setResumeInfo } = useContext(
        ResumeInfoContext
    ) as ResumeInfoContextType;

    const [loading, setLoading] = useState(false);

    const GenerateSummaryFromAi = async () => {
        setLoading(true);
        if (!resumeInfo?.experience[index].title) {
            toast("Please add position title");
            return;
        }

        const prompt = PROMPT.replace(
            "{positionTitle}",
            resumeInfo.experience[index].title
        );

        const result = await AIChatSession.sendMessage(prompt);

        const resp = result.response.text();

        const parseData = JSON.parse(resp);

        setLoading(false);

        setValues(parseData.summary);

        const experiences = resumeInfo.experience;
        experiences[index].workSummary = parseData.summary;

        setResumeInfo({
            ...resumeInfo,
            experience: experiences,
        });
    };

    useEffect(() => {
        setValues(resumeInfo?.experience[index]?.workSummary);
    }, []);

    return (
        <div>
            <div className="flex justify-between my-2 ">
                <label className="text-xs">Summary</label>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex gap-2 border-primary text-primary"
                    onClick={GenerateSummaryFromAi}
                >
                    {loading ? (
                        <LoaderCircle className="animate-spin" />
                    ) : (
                        <SparklesIcon className="h-4 w-4" />
                    )}
                    Generate from AI
                </Button>
            </div>
            <EditorProvider>
                <Editor
                    value={values}
                    onChange={(e) => {
                        setValues(e.target.value);
                        onRichTextEditorChange(e);
                    }}
                >
                    <Toolbar>
                        <BtnBold />
                        <BtnItalic />
                        <BtnUnderline />
                        <BtnStrikeThrough />
                        <Separator />
                        <BtnNumberedList />
                        <BtnBulletList />
                        <Separator />
                        <BtnLink />
                    </Toolbar>
                </Editor>
            </EditorProvider>
        </div>
    );
}
