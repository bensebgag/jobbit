export interface SikllsDetail{
    iconUrl:string;
    skillID:number;
    name: string;
}
export interface JobDetails {
    companyID:number;
    companyName:string;
    jobID:number;
    logoPath:string;
    postedDate:Date;
    title:string;
    wilayaName:string;
    skills :SikllsDetail[]
}

export interface Job{
    categoryName: string;
    jobLists:JobDetails[]

}

export  interface keyWords {
    id: number ;
    name: string ;
    title?: string ;
}

export interface dataForSubmitRegister{
Email: string ;
Password: string;
Phone: string;
FirstName: string;
LastName: string;
Gender: string;
CV: string;
Skils: SkillsGategorie|null|undefined;
}

export interface SkillsGategorie{
    skillID: number;
    skillCategoryID: number;
    name: string;
    iconUrl: string;
}

export  interface Wilaya{
    wilayaID: number;
    name: string;
}
export interface UpdateJobSeekerType{
    JobSeekerID:number;
    WilayaID:number;
    Email:string;
    Phone:string;
    FirstName:string;
    LastName:string;
    DateOfBirth:Date;
    Gender?:number;
    ProfileImage:string;
    CV:string;
    LinkProfileLinkden:string;
    LinkProfileGithub:string;
    Skills:SkillsGategorie;
}
export interface FormDataUpdateJobSeeker {
    firstName: string;
    lastName: string;
    dateOfBirth: string; // String because input fields return string dates
    email: string;
    phone: string;
    address: string;
    wilaya?: Wilaya; // Selected Wilaya
    linkedIn: string;
    github: string;
}
export interface JobApplication {
    jobSeekerID: number;
    jobID: number;
    jobOffer: string;
    appliedOn: string; // ISO date string (e.g. "2025-04-11T12:34:56Z")
    company: string;
    status: boolean;
}
export interface Skill {
    skillID: number;
    categoryName: string;
    skillName: string;
    iconUrl: string;
}
export interface postSkillsForJob {
    skillID: number;
    JobSeekerID:number;

}
export interface JobRequest {
    requestID: number;
    companyID: number;
    jobID: number;
    jobSeekerID: number;
    firstName: string;
    lastName: string;
    wilayaName: string;
    dateOfBirth: string;
    gender: number;
    linkProfileLinkden: string;
    linkProfileGithub: string;
    requestDate: string;
}
