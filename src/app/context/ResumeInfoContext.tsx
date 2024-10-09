import { createContext } from "react";
import dummy from "../data/dummy";
import { useContext } from "react";

// @todo rename it to ResumeInfo
export interface ResumeEntry {
    firstName: string ;
    lastName: string;
    jobTitle: string;
    address: string;
    phone: string;
    email: string;
    themeColor: string;
    summary: string;
    experience: Experience[];
    education: Education[];
    skills: Skills[];
}

export interface Experience {
    id?: string;
    title: string;
    companyName: string;
    city: string;
    state: string;
    startDate?: string;
    endDate?: string;
    currentlyWorking: boolean;
    workSummary: string;
    [key: string]: any;
}

export interface Education {
    id?: string;
    universityName: string;
    startDate: string;
    endDate: string;
    major: string;
    degree: string;
    description: string;
    [key: string]: any;
}

export interface Skills {
    id?: string;
    name: string;
    rating: number;
    [key: string]: any;
}

export type ResumeInfoContextType = {
    resumeInfo: ResumeEntry | null;
    setResumeInfo: (resumeInfo: ResumeEntry) => void;
    resumeEntry: any | null;
    setResumeEntry: (resumeEntry: any) => void;
};

export const ResumeInfoContext = createContext<
    ResumeInfoContextType | undefined
>(undefined);

// export default function useResumeInfoContext() {
//     let { resumeInfo, setResumeInfo, resumeEntry, setResumeEntry } = useContext(
//         ResumeInfoContext
//     ) as ResumeInfoContextType;
//     if (!resumeInfo) {
//         throw Error("setResumeEntry not found");
//     }
//     if (!setResumeInfo) {
//         throw Error("setResumeEntry not found");
//     }
//     if (!resumeEntry) {
//         throw Error("setResumeEntry not found");
//     }
//     if (!setResumeEntry) {
//         throw Error("setResumeEntry not found");
//     }

//     return { resumeInfo, setResumeInfo, resumeEntry, setResumeEntry };
// }
