"use client";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { ListFilter, X } from "lucide-react";
import useFocus from "@/hooks/useFocus";
import { useCallback, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useKeyWords } from "@/contextes/KeyWordsContext";
import { useQuery } from "@tanstack/react-query";
import {
  fetchJobsByTitles,
  getAllFilterJobs,
} from "@/utils/ApisFunctions/JobsApi";
import { keyWords } from "@/utils/types";
import Spinner from "./Spinner";

export default function SearchBar() {
  const {
    keyWords,
    setKeyWords,
    setWilayaIDs,
    setSkillsIDs,
    setJobExperienceIDs,
    setJobTypeIDs,
    handleClickGatogrie,
    setTitleJob,
  } = useKeyWords();

  const { data, isLoading } = useQuery({
    queryKey: ["keys"],
    queryFn: getAllFilterJobs,
  });

  const { data: jobsBytitels, isLoading: isFetchingTitles } = useQuery({
    queryKey: ["getJobsBytitles"],
    queryFn: fetchJobsByTitles,
  });

  const { ref, isFocused, handleFocus, setIsFocused } = useFocus();
  const [showAll, setShowAll] = useState<Record<number, boolean>>({});
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);

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
    // Reset selected index when search query changes
    setSelectedIndex(-1);
  }

  function handleClickOnTitle(title: string) {
    setSearchInput(title);
    setTitleJob(title);
  }

  const matchQuery = useCallback(
    (title: string): string[] => {
      const searchTerm = title.toLowerCase();
      return (
        jobsBytitels?.filter((jobTitle) =>
          jobTitle.toLowerCase().includes(searchTerm)
        ) || []
      );
    },
    [jobsBytitels]
  );

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
  const [displayTitles, setDisplayTitles] = useState<string[]>([]);

  useEffect(() => {
    const filtered =
      searchInput.length === 0 ? jobsBytitels : matchQuery(searchInput);
    setDisplayTitles(filtered || []);
  }, [searchInput, jobsBytitels, matchQuery]);

  const handleKeyDown = useCallback(
    (e) => {
      if (!isFocused || displayTitles.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prevIndex) => {
            const newIndex =
              prevIndex < displayTitles.length - 1 ? prevIndex + 1 : 0;

            if (listRef.current) {
              const listItems = listRef.current.querySelectorAll("li");
              if (listItems[newIndex]) {
                listItems[newIndex].scrollIntoView({
                  block: "nearest",
                  behavior: "smooth",
                });
              }
            }
            return newIndex;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prevIndex) => {
            const newIndex =
              prevIndex > 0 ? prevIndex - 1 : displayTitles.length - 1;

            if (listRef.current) {
              const listItems = listRef.current.querySelectorAll("li");
              if (listItems[newIndex]) {
                listItems[newIndex].scrollIntoView({
                  block: "nearest",
                  behavior: "smooth",
                });
              }
            }
            return newIndex;
          });
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < displayTitles.length) {
            handleClickOnTitle(displayTitles[selectedIndex]);
            inputRef.current?.blur();
            setIsFocused(false);
          }
          break;
        case "Escape":
          e.preventDefault();
          inputRef.current?.blur();
          break;
      }
    },
    [isFocused, displayTitles, selectedIndex, handleClickOnTitle]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isFocused) {
      setSelectedIndex(-1);
    }
  }, [isFocused]);

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
          ref={inputRef}
          onFocus={() => handleFocus()}
          className="flex-1 py-2 sm:py-3 md:py-4 rounded-lg outline-none text-sm"
          onChange={handleSearchChange}
          value={searchInput}
          placeholder="Search keywords..."
        />
        {searchInput.length > 0 && (
          <X
            onClick={() => {
              setSearchInput("");
              setTitleJob("");
            }}
            className="w-4 h-4 hover:cursor-pointer "
          />
        )}

        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute overflow-y-scroll w-full top-full left-0 bg-white z-20 border-[1px] border-b-gray-400 rounded-sm h-64"
            >
              <div className="flex flex-col gap-2 py-4">
                <ul ref={listRef}>
                  {isFetchingTitles ? (
                    <Spinner />
                  ) : (
                    displayTitles?.map((title, index) => (
                      <li
                        onClick={() => handleClickOnTitle(title)}
                        className={`text-sm text-gray-800 font-medium p-3 hover:bg-gray-300 hover:cursor-pointer ${
                          selectedIndex === index ? "bg-blue-100" : ""
                        }`}
                        key={index}
                      >
                        {title}
                      </li>
                    ))
                  )}
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
              {isLoading ? (
                <Spinner />
              ) : (
                fileterBy.map((cateogrie, catIndex) => (
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

                        {cateogrie.filters.length > 10 &&
                          !showAll[catIndex] && (
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
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
}
