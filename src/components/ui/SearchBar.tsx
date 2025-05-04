"use client";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { ListFilter, X } from "lucide-react";
import useFocus from "@/hooks/useFocus";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useKeyWords } from "@/contextes/KeyWordsContext";
import { useQuery } from "@tanstack/react-query";
import { getAllFilterJobs } from "@/utils/ApisFunctions/JobsApi";
import { keyWords } from "@/utils/types";

export default function SearchBar() {
  const {
    keyWords,
    setKeyWords,
    setWilayaIDs,
    setSkillsIDs,
    setJobExperienceIDs,
    setJobTypeIDs,
    handleClickGatogrie,
  } = useKeyWords();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["keys"],
    queryFn: getAllFilterJobs,
  });

  const fileters = [
    {
      title: "by job",
      filers: [
        { id: 1, name: "Full-Time" },
        { id: 2, name: "Part-Time" },
        { id: 3, name: "Freelance" },
        { id: 4, name: "Remote" },
        { id: 5, name: "Contract" },
        { id: 6, name: "Internship" },
        { id: 7, name: "Temporary" },
        { id: 8, name: "Commission-Based" },
        { id: 9, name: "Volunteer" },
        { id: 10, name: "Hybrid" },
        { id: 11, name: "Consulting" },
        { id: 12, name: "On-Site" },
        { id: 13, name: "Work-From-Home" },
        { id: 14, name: "Project-Based" },
        { id: 15, name: "Apprenticeship" },
        { id: 16, name: "Self-Employed" },
        { id: 17, name: "Government Job" },
        { id: 18, name: "Corporate Job" },
        { id: 19, name: "Startup Job" },
        { id: 20, name: "Casual Work" },
      ],
    },
    {
      title: "by level of experience",
      filers: [
        { id: 1, name: "Beginner" },
        { id: 2, name: "Intermediate" },
        { id: 3, name: "Advanced" },
        { id: 4, name: "Expert" },
        { id: 5, name: "Senior Specialist" },
        { id: 6, name: "Lead Engineer" },
        { id: 7, name: "Principal Consultant" },
        { id: 8, name: "Junior Developer" },
        { id: 9, name: "Mid-Level Developer" },
        { id: 10, name: "Senior Developer" },
        { id: 11, name: "Tech Lead" },
        { id: 12, name: "Data Analyst" },
        { id: 13, name: "Cloud Architect" },
        { id: 14, name: "Cybersecurity Analyst" },
        { id: 15, name: "AI Engineer" },
        { id: 16, name: "Marketing Strategist" },
        { id: 17, name: "Financial Analyst" },
        { id: 18, name: "Product Manager" },
        { id: 19, name: "HR Manager" },
        { id: 20, name: "Operations Director" },
      ],
    },
    {
      title: "by wilaya",
      filers: [
        { id: 1, name: "Algiers" },
        { id: 2, name: "Oran" },
        { id: 3, name: "Constantine" },
        { id: 4, name: "Annaba" },
        { id: 5, name: "Batna" },
        { id: 6, name: "Blida" },
        { id: 7, name: "Tizi Ouzou" },
        { id: 8, name: "Setif" },
        { id: 9, name: "Béjaïa" },
        { id: 10, name: "Tlemcen" },
        { id: 11, name: "Djelfa" },
        { id: 12, name: "Sidi Bel Abbès" },
        { id: 13, name: "Biskra" },
        { id: 14, name: "Ouargla" },
        { id: 15, name: "Mostaganem" },
        { id: 16, name: "El Oued" },
        { id: 17, name: "Boumerdès" },
        { id: 18, name: "Ghardaïa" },
        { id: 19, name: "Tiaret" },
        { id: 20, name: "Adrar" },
      ],
    },
    {
      title: "by technology",
      filers: [
        { id: 1, name: "Software Development" },
        { id: 2, name: "Data Science" },
        { id: 3, name: "Graphic Design" },
        { id: 4, name: "Cybersecurity" },
        { id: 5, name: "Artificial Intelligence" },
        { id: 6, name: "Marketing" },
        { id: 7, name: "Finance" },
        { id: 8, name: "Project Management" },
        { id: 9, name: "Human Resources" },
        { id: 10, name: "Mobile App Development" },
        { id: 11, name: "Cloud Computing" },
        { id: 12, name: "IT Support" },
        { id: 13, name: "Content Writing" },
        { id: 14, name: "SEO Optimization" },
        { id: 15, name: "UI/UX Design" },
        { id: 16, name: "Game Development" },
        { id: 17, name: "Blockchain" },
        { id: 18, name: "Machine Learning" },
        { id: 19, name: "Social Media Management" },
        { id: 20, name: "Business Analysis" },
      ],
    },
  ];

  const { ref, isFocused, handleFocus } = useFocus();
  const [showAll, setShowAll] = useState<Record<number, boolean>>({});

  function toggleShowAll(index: number) {
    setShowAll((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }

  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  function test(item, title) {
    handleClickGatogrie(item, title);
  }

  function handleSearchChange(e) {
    setSearchInput(e.target.value);
  }

  function handleRemoveKeyWords(index: number, key: keyWords, title: string) {
    setKeyWords((prev) => prev.filter((_, i) => i != index));
    switch (title) {
      case "by job type":
        setJobTypeIDs((pre) => pre.filter((id) => id != key.id));
        break;
      case "by level of experience":
        setJobExperienceIDs((pre) => pre.filter((id) => id != key.id));
        break;
      case "by wilaya":
        setWilayaIDs((pre) => pre.filter((id) => id != key.id));
        break;
      case "by technology":
        setSkillsIDs((pre) => pre.filter((id) => id != key.id));
        break;
    }
  }

  const fileterBy = data;

  return (
    <Container styleElement="mt-6 sm:mt-10 md:mt-16 lg:mt-20">
      <div
        ref={ref}
        className={`flex flex-wrap items-center gap-1 px-2 border-[1px] bg-white rounded-lg relative ${
          isFocused ? "border-blue-500 border-[2px]" : "border-gray-400"
        }`}
      >
        <Button
          onClick={() => setOpen(true)}
          className="text-white flex items-center gap-1 font-bold text-xs sm:text-sm md:text-lg bg-green-700 hover:cursor-pointer my-2"
        >
          <ListFilter className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden xs:inline">FILTER</span>
        </Button>

        <div className="flex flex-wrap gap-1 items-center">
          {keyWords?.map((keyword, index: number) => (
            <div
              className="flex items-center gap-1 py-1 px-2 sm:py-2 sm:px-4 rounded-full bg-blue-500"
              key={index}
            >
              <span className="text-white text-xs sm:text-sm truncate max-w-32 sm:max-w-40">
                {keyword.name}
              </span>
              <X
                onClick={() =>
                  handleRemoveKeyWords(index, keyword, keyword.title)
                }
                className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-100 rounded-full text-blue-500 hover:cursor-pointer hover:bg-blue-50"
              />
            </div>
          ))}
        </div>

        <input
          onFocus={() => handleFocus()}
          className="flex-1 py-2 sm:py-3 md:py-4 rounded-lg outline-none text-sm"
          onChange={handleSearchChange}
          value={searchInput}
          placeholder="Search keywords..."
        />

        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute overflow-y-scroll w-full top-full left-0 bg-white z-20 border-[1px] border-b-gray-400 rounded-sm h-64"
            >
              <div className="flex flex-col gap-2 p-4">
                <p className="text-gray-600 font-medium text-base">
                  Contract type
                </p>
                <ul className="px-2 sm:px-4 text-xs sm:text-sm flex flex-col text-gray-800 font-medium">
                  <li className="p-2 sm:p-3 hover:bg-gray-200 hover:cursor-pointer">
                    CDD (fixed term)
                  </li>
                  <li className="p-2 sm:p-3 hover:bg-gray-200 hover:cursor-pointer">
                    CDI (permanent)
                  </li>
                  <li className="p-2 sm:p-3 hover:bg-gray-200 hover:cursor-pointer">
                    Freelance
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            exit={{ opacity: 0 }}
            className="flex flex-col item-center gap-3 sm:gap-6 p-2 sm:p-4 bg-white mt-2 sm:mt-4 rounded-lg"
          >
            <X
              onClick={() => setOpen(false)}
              className="self-end hover:cursor-pointer"
            />

            <div className="flex flex-col md:flex-row items-start gap-4 md:justify-between">
              {fileterBy.map((cateogrie, catIndex) => (
                <div
                  className="flex flex-col self-start gap-2 w-full md:w-auto"
                  key={catIndex}
                >
                  <p className="text-xs sm:text-sm font-medium text-gray-950">
                    {cateogrie.title}
                  </p>

                  <div className="grid grid-cols-2 gap-1">
                    <AnimatePresence>
                      {cateogrie.filters.length > 10 && !showAll[catIndex]
                        ? cateogrie.filters.slice(0, 6).map((item, index) => (
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              layout
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.1,
                                delay: index * 0.03,
                              }}
                              exit={{ opacity: 0, x: -10 }}
                              className="rounded-full text-center p-1 sm:p-2 text-white text-[8px] sm:text-[10px] font-medium bg-gray-500 hover:cursor-pointer truncate"
                              onClick={() => test(item, cateogrie.title)}
                              key={index}
                            >
                              <span>{item.name}</span>
                            </motion.div>
                          ))
                        : cateogrie.filters.map((item, index) => (
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              layout
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.1,
                                delay: index * 0.03,
                              }}
                              exit={{ opacity: 0, x: -10 }}
                              onClick={() => test(item, cateogrie.title)}
                              className="rounded-full text-center p-1 sm:p-2 text-white text-[8px] sm:text-[12px] font-medium bg-gray-500 hover:cursor-pointer truncate"
                              key={index}
                            >
                              <span>{item.name}</span>
                            </motion.div>
                          ))}

                      {cateogrie.filters.length > 10 && !showAll[catIndex] && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          layout
                          transition={{ duration: 0.3 }}
                          exit={{ opacity: 0, x: -10 }}
                          onClick={() => toggleShowAll(catIndex)}
                          className="text-green-700 flex items-center justify-center text-[10px] sm:text-[12px] font-normal border border-green-300 rounded-lg hover:cursor-pointer p-1"
                        >
                          <span>SHOW MORE...</span>
                        </motion.div>
                      )}

                      {cateogrie.filters.length > 10 && showAll[catIndex] && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          layout
                          transition={{ duration: 0.3 }}
                          exit={{ opacity: 0, x: -10 }}
                          onClick={() => toggleShowAll(catIndex)}
                          className="text-green-700 flex items-center justify-center text-[10px] sm:text-[12px] p-1 font-normal border border-green-300 rounded-lg hover:cursor-pointer"
                        >
                          <span>SHOW LESS...</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
}
