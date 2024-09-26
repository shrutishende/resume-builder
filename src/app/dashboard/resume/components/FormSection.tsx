import React, { useState } from "react";
import PersonalDetail from "./forms/PersonalDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";
import Summery from "./forms/Summery";
import Experience from "./forms/Experience";
import Skills from "./forms/Skills";

export default function FormSection() {
    const [activeFormIndex, setActiveFormIndex] = useState(1);
    const [enableNext, setEnableNext] = useState(false);
    return (
        <div>
            <div className="flex justify-between items-center ">
                <Button variant="outline" size="sm" className="flex gap-2">
                    <LayoutGrid /> Theme
                </Button>
                <div className="flex gap-2">
                    {activeFormIndex > 1 && (
                        <Button
                            size="sm"
                            onClick={() =>
                                setActiveFormIndex(activeFormIndex - 1)
                            }
                        >
                            <ArrowLeft />
                        </Button>
                    )}
                    <Button
                        //  disabled={!enableNext}
                        className="flex gap-2"
                        size="sm"
                        onClick={() => setActiveFormIndex(activeFormIndex + 1)}
                    >
                        Next <ArrowRight />
                    </Button>
                </div>
            </div>

            {activeFormIndex === 1 ? (
                <PersonalDetail
                    enabledNext={(v: boolean) => setEnableNext(v)}
                />
            ) : activeFormIndex === 2 ? (
                <Summery enabledNext={(v: boolean) => setEnableNext(v)} />
            ) : activeFormIndex === 3 ? (
                <Experience enabledNext={(v: boolean) => setEnableNext(v)} />
            ) : activeFormIndex === 4 ? (
                <Skills />
            ) : null}
        </div>
    );
}
