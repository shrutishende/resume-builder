import React from "react";

export default function PersonelDetailPreview({ resumeInfo }) {
    //console.log("preview", resumeInfo?.items[0].fields);
    return (
        <div>
            <h2
                className="font-bold text-xl text-center"
                 style={{ color: resumeInfo?.themeColor }}
                
            >
                {resumeInfo?.firstName} 
                {resumeInfo?.lastName}
            </h2>
            <h2 className="text-center text-sm font-medium">
                {resumeInfo?.title}
            </h2>
            <h2
                className="text-center text-xs font-normal"
                style={{ color: resumeInfo?.themeColor }}
                
            >
                {resumeInfo?.address}
            </h2>
            <div className="flex justify-between">
                <h2
                    className="font-normal text-xs"
                     style={{ color: resumeInfo?.themeColor }}
                    
                >
                    {resumeInfo?.phone}
                </h2>
                <h2
                    className="font-normal text-xs"
                    style={{ color: resumeInfo?.themeColor }}
                    
                >
                    {resumeInfo?.email}
                </h2>
            </div>
            <hr
                className="border-[1.5px] my-2"
                style={{ borderColor: resumeInfo?.themeColor }}
               
            />
        </div>
    );
}
