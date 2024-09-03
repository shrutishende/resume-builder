import { ResumeInfoContext } from "@/app/context/ResumeInfoContext";
import { Button } from "@/components/ui/button";
import { LoaderCircle, SparklesIcon } from "lucide-react";
import React, { useContext, useState } from "react";
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
    "position titile: {positionTitle} , Depends on position title give me 5-7 bullet points for my experience in resume (Please do not add experince level and No JSON array) , give me result in HTML format";

export default function RichTextEditor({ onRichTextEditorChange, index }) {
    const [value, setValue] = useState();
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [loading, setLoading] = useState(false);

    const GenerateSummaryFromAi = async () => {
        setLoading(true);
        if (!resumeInfo.experience[index].title) {
            toast("Please add position title");
            return;
        }

        const prompt = PROMPT.replace(
            "{positionTitle}",
            resumeInfo.experience[index].title
        );

        const result = await AIChatSession.sendMessage(prompt);

        console.log(result.response.text());
        const resp = result.response.text();
        setValue(
            resp
                .replace("[", "")
                .replace("]", "")
                .replace("{", "")
                .replace("}", "")
        );
        setLoading(false);
    };

    console.log(value);
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
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
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
