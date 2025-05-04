import { JobSeeker } from "@/app/aplay/[aplayId]/page";

export interface SikllsDetail {
  iconUrl: string;
  skillID: number;
  name: string;
}
export interface JobDetails {
  companyID: number;
  companyName: string;
  jobID: number;
  logoPath: string;
  postedDate: Date;
  title: string;
  wilayaName: string;
  skillsIconUrl: string[];
}

export interface Job {
  categoryName: string;
  jobLists: JobDetails[];
}

export interface keyWords {
  id: number;
  name: string;
  title?: string;
}

export interface dataForSubmitRegister {
  Email: string;
  Password: string;
  Phone: string;
  FirstName: string;
  LastName: string;
  Gender: string;
  CV: File | null;
  Skils: number[] | null;
}

export interface dataForSubmitRegisterCompany {
  wilayaID: number | null;
  email: string;
  password: string;
  phone: string;
  name: string;
  link: string;
}
export interface SkillsGategorie {
  skillID: number;
  skillCategoryID: number;
  name: string;
  iconUrl: string;
}

export interface Wilaya {
  wilayaID: number;
  name: string;
}

export interface UpdateJobSeekerType {
  JobSeekerID: number;
  WilayaID: number;
  Email: string;
  Phone: string;
  FirstName: string;
  LastName: string;
  DateOfBirth: Date;
  Gender?: number;
  ProfileImage: File | null;
  CV: string;
  LinkProfileLinkden: string;
  LinkProfileGithub: string;
  Skills: SkillsGategorie;
}
export interface FormDataUpdateJobSeeker {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  wilaya?: Wilaya;
  linkedIn: string;
  github: string;
}
export interface JobApplication {
  jobSeekerID: number;
  jobID: number;
  jobOffer: string;
  appliedOn: string;
  company: string;
  status: boolean;
}
export interface Skill {
  skillID: number;
  categoryName: string;
  name: string;
  iconUrl: string;
}
export interface postSkillsForJob {
  skillID: number;
  JobSeekerID: number;
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
export interface Login {
  email: string;
  password: string;
}

interface ApplicantForCompanyJob {
  requestID: number;
  postedDate: string;
  jobTitle: string;
}

interface JobApplicationStatus {
  status: boolean;
  statusAsText: string;
  applicantForCompanyJob: ApplicantForCompanyJob[];
}

export type JobApplicationStatusList = JobApplicationStatus[];

export interface JobsForCompany {
  jobID: number;
  title: string;
  postedDate: string;
  available: boolean;
}

interface CompanyInfo {
  companyID: number;
  wilayaInfo: Wilaya;
  name: string;
  description: string;
  logoPath: string;
  link: string;
  email: string;
  phone: string;
  isActive: boolean;
}

export interface AuthCompanyResponse {
  token: string;
  role: string;
  allCompanyInfo: CompanyInfo;
}

interface JobSeekerInfo {
  jobSeekerID: number;
  wilayaInfo: Wilaya;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  profilePicturePath: string;
  cvFilePath: string;
  linkProfileLinkden: string;
  linkProfileGithub: string;
  email: string;
  phone: string;
  isActive: boolean;
  skills: Skill[];
}

export interface AuthJobSeekerResponse {
  token: string;
  role: string;
  allJobSeekerInfo: JobSeekerInfo;
}

export interface JobRequest {
  requestID: number;
  jobSeekerInfo: JobSeeker;
  jobInfo: Job;
  date: string;
  status: boolean;
}

export interface Job {
  jobID: number;
  comapnyInfo: {
    companyID: number;
    wilayaInfo: {
      wilayaID: number;
      name: string;
    };
    name: string;
    description: string;
    logoPath: string;
    link: string;
    email: string;
    phone: string;
    isActive: boolean;
  };
  jobType: string;
  postedDate: string; // ISO date string
  experience: string;
  available: boolean;
  title: string;
  description: string;
  skills: Skill[];
}
