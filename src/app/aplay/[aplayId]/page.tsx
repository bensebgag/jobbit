


// types.ts
export interface Wilaya {
    wilayaID: number;
    name: string;
}

export interface Skill {
    skillID: number;
    skillCategoryID: number;
    name: string;
    iconUrl: string;
}

export interface JobSeeker {
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

export interface Company {
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

export interface Job {
    jobID: number;
    comapnyInfo: Company;
    jobType: string;
    postedDate: string;
    experience: string;
    available: boolean;
    title: string;
    description: string;
    skills: Skill[];
}

export interface JobRequest {
    requestID: number;
    jobSeekerInfo: JobSeeker;
    jobInfo: Job;
    date: string;
    status: boolean;
}

// page.tsx

import Image from 'next/image';


export default function JobRequestPage() {
    // In a real app, you would fetch this data from an API
    const jobRequest: JobRequest = {
        requestID: 12345,
        jobSeekerInfo: {
            jobSeekerID: 1001,
            wilayaInfo: {
                wilayaID: 16,
                name: "Algiers"
            },
            firstName: "Ahmed",
            lastName: "Benali",
            dateOfBirth: "1995-04-15T00:00:00",
            gender: "Male",
            profilePicturePath: "/images/profile.jpg",
            cvFilePath: "/files/cv.pdf",
            linkProfileLinkden: "https://linkedin.com/in/ahmedbenali",
            linkProfileGithub: "https://github.com/ahmedbenali",
            email: "ahmed.benali@email.com",
            phone: "+213 555 123 456",
            isActive: true,
            skills: [
                {
                    skillID: 1,
                    skillCategoryID: 1,
                    name: "React",
                    iconUrl: "/icons/react.svg"
                },
                {
                    skillID: 2,
                    skillCategoryID: 1,
                    name: "TypeScript",
                    iconUrl: "/icons/typescript.svg"
                }
            ]
        },
        jobInfo: {
            jobID: 2001,
            comapnyInfo: {
                companyID: 101,
                wilayaInfo: {
                    wilayaID: 16,
                    name: "Algiers"
                },
                name: "TechAlgeria",
                description: "Leading tech company in Algeria",
                logoPath: "/images/company-logo.png",
                link: "https://techalgeria.com",
                email: "contact@techalgeria.com",
                phone: "+213 555 987 654",
                isActive: true
            },
            jobType: "Full-time",
            postedDate: "2025-04-01T09:00:00",
            experience: "3+ years",
            available: true,
            title: "Frontend Developer",
            description: "We are looking for a skilled Frontend Developer with experience in React and TypeScript.",
            skills: [
                {
                    skillID: 1,
                    skillCategoryID: 1,
                    name: "React",
                    iconUrl: "/icons/react.svg"
                },
                {
                    skillID: 2,
                    skillCategoryID: 1,
                    name: "TypeScript",
                    iconUrl: "/icons/typescript.svg"
                }
            ]
        },
        date: "2025-04-10T14:30:00",
        status: true
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-600 p-6 text-white">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold">Job Request #{jobRequest.requestID}</h1>
                            <div className="flex items-center">
                <span className={`px-3 py-1 rounded-full text-sm ${jobRequest.status ? 'bg-green-500' : 'bg-red-500'}`}>
                  {jobRequest.status ? 'Active' : 'Inactive'}
                </span>
                                <span className="ml-4 text-sm">
                  {formatDate(jobRequest.date)}
                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Job Seeker Information */}
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                                        <Image
                                            src={jobRequest.jobSeekerInfo.profilePicturePath}
                                            alt={`${jobRequest.jobSeekerInfo.firstName} ${jobRequest.jobSeekerInfo.lastName}`}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">
                                        {jobRequest.jobSeekerInfo.firstName} {jobRequest.jobSeekerInfo.lastName}
                                    </h2>
                                    <p className="text-gray-600">
                                        {jobRequest.jobSeekerInfo.wilayaInfo.name}
                                    </p>
                                    <div className="mt-2 flex space-x-3">
                                        <a
                                            href={jobRequest.jobSeekerInfo.linkProfileLinkden}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            LinkedIn
                                        </a>
                                        <a
                                            href={jobRequest.jobSeekerInfo.linkProfileGithub}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            GitHub
                                        </a>
                                        <a
                                            href={jobRequest.jobSeekerInfo.cvFilePath}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            View CV
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold text-lg mb-2">Contact Information</h3>
                                <div className="space-y-2">
                                    <p className="flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                        {jobRequest.jobSeekerInfo.email}
                                    </p>
                                    <p className="flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                        </svg>
                                        {jobRequest.jobSeekerInfo.phone}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold text-lg mb-2">Personal Details</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Birth Date</p>
                                        <p>{formatDate(jobRequest.jobSeekerInfo.dateOfBirth)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Gender</p>
                                        <p>{jobRequest.jobSeekerInfo.gender}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold text-lg mb-2">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {jobRequest.jobSeekerInfo.skills.map(skill => (
                                        <div key={skill.skillID} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center">
                                            <img src={skill.iconUrl} alt={skill.name} className="w-4 h-4 mr-1" />
                                            {skill.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Job Information */}
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 rounded overflow-hidden bg-gray-200">
                                        <Image
                                            src={jobRequest.jobInfo.comapnyInfo.logoPath}
                                            alt={jobRequest.jobInfo.comapnyInfo.name}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{jobRequest.jobInfo.title}</h2>
                                    <p className="text-gray-600">{jobRequest.jobInfo.comapnyInfo.name}</p>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {jobRequest.jobInfo.comapnyInfo.wilayaInfo.name} • {jobRequest.jobInfo.jobType} • {jobRequest.jobInfo.experience}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">Posted: {formatDate(jobRequest.jobInfo.postedDate)}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold text-lg mb-2">Job Description</h3>
                                <p className="text-gray-700 whitespace-pre-line">{jobRequest.jobInfo.description}</p>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold text-lg mb-2">Required Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {jobRequest.jobInfo.skills.map(skill => (
                                        <div key={skill.skillID} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full flex items-center">
                                            <img src={skill.iconUrl} alt={skill.name} className="w-4 h-4 mr-1" />
                                            {skill.name}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold text-lg mb-2">Company Information</h3>
                                <div className="space-y-2">
                                    <p className="text-gray-700">{jobRequest.jobInfo.comapnyInfo.description}</p>
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                        <a href={`mailto:${jobRequest.jobInfo.comapnyInfo.email}`} className="text-blue-600 hover:underline">
                                            {jobRequest.jobInfo.comapnyInfo.email}
                                        </a>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                        </svg>
                                        {jobRequest.jobInfo.comapnyInfo.phone}
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                                        </svg>
                                        <a href={jobRequest.jobInfo.comapnyInfo.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            {jobRequest.jobInfo.comapnyInfo.link.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer with Action Buttons */}
                    <div className="border-t px-6 py-4 bg-gray-50 flex justify-end space-x-4">
                        <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition">
                            Reject
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                            Accept
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// utils.ts
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}