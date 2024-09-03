import React from "react";


export default function SummeryPreview({ resumeInfo }) {
    return (
        <>
            <p className="text-xs">{resumeInfo?.summery}</p>
        </>
    );
}
