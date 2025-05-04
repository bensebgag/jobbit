"use client";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFilteredJobs } from "@/utils/ApisFunctions/JobsApi";
import { Job, keyWords } from "@/utils/types";
interface filtersCat {
  wilayaIDs: number[];
  skillsIDs: number[];
  jobTypeIDs: number[];
  jobExperienceIDs: number[];
}

type KeyWordsContextType = {
  keyWords: keyWords[];
  setKeyWords: React.Dispatch<React.SetStateAction<keyWords[]>>;
  handleClickGatogrie: (item: keyWords, title: string) => void;
  filtersCat: filtersCat;
  data: Job;
  showAll: boolean;
  setShowAll: React.Dispatch<React.SetStateAction<boolean>>;
  dataFilter: Job[];
  setJobTypeIDs: React.Dispatch<React.SetStateAction<number[]>>;
  setJobExperienceIDs: React.Dispatch<React.SetStateAction<number[]>>;
  setWilayaIDs: React.Dispatch<React.SetStateAction<number[]>>;
  setSkillsIDs: React.Dispatch<React.SetStateAction<number[]>>;
  isLoading: boolean;
  isError: boolean;
  error: Error;
};
const testAllJobs = Array.from({ length: 12 }, (_, sectionIndex) => ({
  categoryName: `Sample Section ${sectionIndex + 1}`,
  jobLists: Array.from({ length: 40 }, (__, index) => ({
    logoPath: `https://example.com/image${index}.jpg`,
    title: `Item Title ${index + 1}`,
    skills: [
      {
        iconUrl: `https://example.com/skill${index}_1.jpg`,
        skillID: 1,
        name: "text",
      },
      {
        iconUrl: `https://example.com/skill${index}_2.jpg`,
        skillID: 2,
        name: "text",
      },
      {
        iconUrl: `https://example.com/skill${index}_3.jpg`,
        skillID: 3,
        name: "text",
      },
      {
        iconUrl: `https://example.com/skill${index}_4.jpg`,
        skillID: 4,
        name: "text",
      },
    ],
    wilayaName: `Location ${index + 1}`,
    companyName: `Company ${index + 1}`,
    postedDate: new Date(),
  })),
}));

const KeyWordsContext = createContext<KeyWordsContextType | undefined>(
  undefined
);

interface KeyWordsProviderProps {
  children: ReactNode;
}

export const KeyWordsContextProvider = ({
  children,
}: KeyWordsProviderProps): JSX.Element => {
  const [keyWords, setKeyWords] = useState<keyWords[]>([]);

  const [wilayaIDs, setWilayaIDs] = useState<number[]>([]);
  const [skillsIDs, setSkillsIDs] = useState<number[]>([]);
  const [jobTypeIDs, setJobTypeIDs] = useState<number[]>([]);
  const [jobExperienceIDs, setJobExperienceIDs] = useState<number[]>([]);

  const [showAll, setShowAll] = useState<boolean>(false);

  function handleClickGatogrie(keyWordG: keyWords, title: string) {
    switch (title) {
      case "by job type":
        setKeyWords((prev) => [...prev, { title, ...keyWordG }]);
        return setJobTypeIDs([...jobTypeIDs, keyWordG.id]);
      case "by level of experience":
        setKeyWords((prev) => [...prev, { title, ...keyWordG }]);
        return setJobExperienceIDs([...jobExperienceIDs, keyWordG.id]);
      case "by wilaya":
        setKeyWords((prev) => [...prev, { title, ...keyWordG }]);
        return setWilayaIDs([...wilayaIDs, keyWordG.id]);
      case "by technology":
        setKeyWords((prev) => [...prev, { title, ...keyWordG }]);
        return setSkillsIDs([...skillsIDs, keyWordG.id]);
    }
  }
  useEffect(() => {
    if (jobTypeIDs.length > 1) {
      setShowAll(true);
    } else {
      setShowAll(false);
    }
  }, [wilayaIDs, skillsIDs, jobTypeIDs, jobExperienceIDs]);

  const filtersCat = {
    wilayaIDs,
    skillsIDs,
    jobTypeIDs,
    jobExperienceIDs,
  };

  const {
    data: jobFilters,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "jobsFilter",
      wilayaIDs,
      skillsIDs,
      jobTypeIDs,
      jobExperienceIDs,
    ],
    queryFn: () => fetchFilteredJobs(filtersCat),
    onError: (error) => {
      console.log("Error fetching filtered jobs:", error);
    },
  });

  const dataFilter = jobFilters;

  return (
    <KeyWordsContext.Provider
      value={{
        keyWords,
        setKeyWords,
        handleClickGatogrie,
        filtersCat,
        dataFilter,
        showAll,
        setShowAll,
        setJobTypeIDs,
        setJobExperienceIDs,
        setSkillsIDs,
        setWilayaIDs,
        isLoading,
        isError,
        error,
      }}
    >
      {children}
    </KeyWordsContext.Provider>
  );
};

export const useKeyWords = () => {
  const context = useContext(KeyWordsContext);
  if (!context) {
    throw new Error(
      "useKeyWords must be used within a KeyWordsContextProvider"
    );
  }
  return context;
};
