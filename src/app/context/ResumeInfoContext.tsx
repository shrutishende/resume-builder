import { createContext } from "react";
import dummy from "../data/dummy";

export interface ResumeEntry {
    firstName: string;
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
    id: number;
    title: string;
    companyName: string;
    city: string;
    state: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
    workSummary: string;
}

export interface Education {
    id: number;
    universityName: string;
    startDate: string;
    endDate: string;
    major: string;
    degree: string;
    description: string;
}

export interface Skills {
    id: number;
    name: string;
    rating: number;
}

export const ResumeInfoContext = createContext<ResumeEntry | null>(null);
