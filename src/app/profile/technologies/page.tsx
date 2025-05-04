"use client";

import { useState } from "react";
import useFocus from "@/hooks/useFocus";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSkills } from "@/utils/ApisFunctions/skillsGateogries";
import { Skill } from "@/utils/types";
import {
  fetchUser,
  PostSkillsForJob,
  RemoveSkillForJob,
} from "@/utils/ApisFunctions/JobsApi";
import Spinner from "@/components/ui/Spinner";
import { useGetUser } from "@/hooks/useGetUser";
import toast from "react-hot-toast";

export default function Technologies() {
  const { userId } = useGetUser();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { ref, handleFocus, isFocused } = useFocus();

  const [selectedItems, setSelectedItems] = useState<Skill[]>([]);

  const { data: userData2 } = useQuery({
    queryKey: ["getUser", userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  });

  // flag to show the saved list
  const [add, setAdd] = useState(false);

  // fetch your full list of possible skills
  const { data, isLoading } = useQuery<Skill[]>({
    queryKey: ["Skills"],
    queryFn: fetchSkills,
  });

  // Add skills mutation - now merges with existing skills instead of replacing
  const { mutate: addSkills } = useMutation({
    mutationFn: (skills: number[]) => PostSkillsForJob(skills, userId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["getUser", userId] });
      const updatedUserData = await fetchUser(userId);
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      toast.success("Skills added successfully");
      setSelectedItems([]);
    },
  });

  // New mutation for removing skills
  const { mutate: removeSkill } = useMutation({
    mutationFn: (skillId: number) => RemoveSkillForJob(userId, skillId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["getUser", userId] });
      const updatedUserData = await fetchUser(userId);
      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      toast.success("Skill removed successfully");
    },
  });

  const displaySkills = userData2?.allJobSeekerInfo?.skills || [];
  const technologies = data;

  const handleSelect = (item: Skill) => {
    if (!selectedItems.includes(item)) {
      setSelectedItems((prev) => [...prev, item]);
    }
  };

  const handleRemove = (item: Skill) => {
    setSelectedItems((prev) => prev.filter((i) => i !== item));
  };

  const handleClickAdd = () => {
    const existingSkillIds = displaySkills.map((skill) => skill.skillID);
    const skillsFoAdd = selectedItems.map((item) => item.skillID);
    const allSkillIds = [...existingSkillIds, ...skillsFoAdd];
    const uniqueSkillIds = [...new Set(allSkillIds)];

    addSkills(uniqueSkillIds);
    setAdd(true);
  };

  // Handle removing an existing skill
  const handleRemoveExistingSkill = (skillId: number) => {
    removeSkill(skillId);
  };

  const filteredItems = technologies?.filter((item) =>
    item?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2 p-4 w-full h-full border-[1px] border-gray-100 bg-white">
      <p className="text-xl font-bold text-gray-950">
        Mastery of technologies & skills
      </p>
      <p className="text-lg font-medium text-gray-950">
        Add technologies/skills
      </p>
      <p className="text-sm font-normal text-gray-800 leading-normal">
        Add the technologies you are proficient in, specify the degree of
        proficiency, and decide if you want to receive job alerts using the bell
        icon.
      </p>

      {displaySkills && displaySkills.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {displaySkills.map((item, index) => (
            <span
              key={index}
              className="px-2 py-1 text-sm font-medium bg-green-500 text-white rounded-full flex items-center gap-1"
            >
              {item?.name}
              <button
                onClick={() => handleRemoveExistingSkill(item.skillID)}
                className="ml-1 hover:bg-red-600 rounded-full p-1"
                title="Remove skill"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-4">
        <div ref={ref} className="w-full bg-white rounded-md shadow-md mt-10">
          <div
            className={`px-2 py-3 flex flex-wrap items-center gap-2 border-[1px] rounded-md ${
              isFocused ? "border-blue-500" : "border-gray-200"
            }`}
          >
            {/* tags for currently selected (but not yet "added") */}
            {selectedItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-1 px-2 py-1 text-sm font-medium bg-gray-200 rounded-full"
              >
                <span>{item.name}</span>
                <button
                  onClick={() => handleRemove(item)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
            ))}

            <input
              onFocus={handleFocus}
              placeholder="Technologies, languages, skills"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-none outline-none min-w-[150px]"
            />

            {isFocused ? (
              <ChevronUp
                onClick={handleFocus}
                className="w-6 h-6 text-gray-400 cursor-pointer"
              />
            ) : (
              <ChevronDown
                onClick={handleFocus}
                className="w-6 h-6 text-gray-400 cursor-pointer"
              />
            )}
          </div>

          {isFocused && (
            <div className="border-t">
              <div className="max-h-[300px] overflow-y-auto">
                {isLoading ? (
                  <Spinner />
                ) : (
                  filteredItems?.map((item) => (
                    <div
                      key={item.skillID}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleSelect(item)}
                    >
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={handleClickAdd}
          disabled={selectedItems.length === 0}
          className={`w-12 h-12 rounded-full flex items-center justify-center mt-10 hover:bg-blue-600 ${
            selectedItems.length > 0 ? "bg-blue-500" : "bg-gray-400"
          }`}
        >
          <Plus className="text-white" />
        </Button>
      </div>
    </div>
  );
}
