'use client';

import { useState, useEffect } from 'react';
import useFocus from '@/hooks/useFocus';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {useMutation, useQuery} from '@tanstack/react-query';
import { fetchSkills } from '@/utils/ApisFunctions/skillsGateogries';
import {Skill} from "@/utils/types";
import {PostSkillsForJob} from "@/utils/ApisFunctions/JobsApi";
import Spinner from "@/components/ui/Spinner";

export default function Technologies() {
    const [searchQuery, setSearchQuery] = useState('');
    const { ref, handleFocus, isFocused } = useFocus();

    // items the user is currently selecting in the dropdown
    const [selectedItems, setSelectedItems] = useState<Skill[]>([]);

    // items that have been "added" (and saved to localStorage)
    const [storageItems, setStorageItems] = useState<Skill[]>([]);

    // flag to show the saved list
    const [add, setAdd] = useState(false);

    // fetch your full list of possible skills
    const { data,isLoading } = useQuery<Skill[]>({
        queryKey: ['Skills'],
        queryFn: fetchSkills,
    });
    const {mutate}=useMutation({
        mutationFn:PostSkillsForJob
    })
    const technologies = data ||[
        {
            skillID: 1,
            categoryName: 'Design',
            skillName: 'Adobe InDesign',
            iconUrl: '/icons/indesign.png',
        },
        {
            skillID: 2,
            categoryName: 'Design',
            skillName: 'Adobe Photoshop',
            iconUrl: '/icons/photoshop.png',
        },
        {
            skillID: 3,
            categoryName: 'Design',
            skillName: 'Adobe Photoshop Express',
            iconUrl: '/icons/photoshop-express.png',
        },
        {
            skillID: 4,
            categoryName: 'Video',
            skillName: 'Adobe Premiere Pro',
            iconUrl: '/icons/premiere.png',
        },
        {
            skillID: 5,
            categoryName: 'Design',
            skillName: 'Adobe XD',
            iconUrl: '/icons/xd.png',
        },
        {
            skillID: 6,
            categoryName: 'Marketing',
            skillName: 'AdRoll',
            iconUrl: '/icons/adroll.png',
        },
        {
            skillID: 7,
            categoryName: 'Design',
            skillName: 'Affinity Designer',
            iconUrl: '/icons/affinity.png',
        },
        {
            skillID: 8,
            categoryName: 'Development',
            skillName: 'Agile',
            iconUrl: '/icons/agile.png',
        },
        {
            skillID: 9,
            categoryName: 'Social Media',
            skillName: 'Agorapulse',
            iconUrl: '/icons/agorapulse.png',
        },
        {
            skillID: 10,
            categoryName: 'Data',
            skillName: 'Airflow',
            iconUrl: '/icons/airflow.png',
        },
        {
            skillID: 11,
            categoryName: 'Productivity',
            skillName: 'Airtable',
            iconUrl: '/icons/airtable.png',
        },
        {
            skillID: 12,
            categoryName: 'DevOps',
            skillName: 'Akamari',
            iconUrl: '/icons/akamari.png',
        },
    ];

    // on mount, load any previously‑saved skills
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const stored = localStorage.getItem('skills');
        if (stored) {
            const parsed = JSON.parse(stored) as Skill[];
            setStorageItems(parsed);
            if (parsed.length > 0) {
                setAdd(true);
            }
        }
    }, []);

    const handleSelect = (item: Skill) => {
        if (!selectedItems.includes(item)) {
            setSelectedItems((prev) => [...prev, item]);
        }
    };

    const handleRemove = (item: Skill) => {
        setSelectedItems((prev) => prev.filter((i) => i !== item));
    };

    const handleClickAdd = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('skills', JSON.stringify(selectedItems));
        }
        setStorageItems(selectedItems);
        setAdd(true);
    };

    // decide which list to render above the input
    const displaySkills =
        storageItems.length > 0 ? storageItems : selectedItems;

    // filter dropdown based on search
    const filteredItems = technologies.filter((item) =>
        item.skillName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-2 p-4 w-full border-[1px] border-gray-100 bg-white">
            <p className="text-xl font-bold text-gray-950">
                Mastery of technologies & skills
            </p>
            <p className="text-lg font-medium text-gray-950">
                Add technologies/skills
            </p>
            <p className="text-sm font-normal text-gray-800 leading-normal">
                Add the technologies you are proficient in, specify the degree of
                proficiency, and decide if you want to receive job alerts using the
                bell icon.
            </p>

            {/* only show once "Add" has been clicked (or if we loaded saved skills) */}
            {add && (
                <div className="flex items-center gap-2">
                    {displaySkills.map((item, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 text-sm font-medium bg-green-500 text-white rounded-full"
                        >
              {item.skillName}
            </span>
                    ))}
                </div>
            )}

            <div className="flex gap-4">
                <div ref={ref} className="w-full bg-white rounded-md shadow-md mt-10">
                    <div
                        className={`px-2 py-3 flex flex-wrap items-center gap-2 border-[1px] rounded-md ${
                            isFocused ? 'border-blue-500' : 'border-gray-200'
                        }`}
                    >
                        {/* tags for currently selected (but not yet "added") */}
                        {selectedItems.map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-1 px-2 py-1 text-sm font-medium bg-gray-200 rounded-full"
                            >
                                <span>{item.skillName}</span>
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
                                {isLoading?<Spinner/>: filteredItems.map((item) => (
                                    <div
                                        key={item.skillID}
                                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => handleSelect(item)}
                                    >
                                        <span className="text-sm">{item.skillName}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <Button
                    onClick={handleClickAdd}
                    disabled={selectedItems.length === 0}
                    className={`w-12 h-12 rounded-full flex items-center justify-center mt-10 hover:bg-blue-600 ${
                        selectedItems.length > 0 ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                >
                    <Plus className="text-white" />
                </Button>
            </div>
        </div>
    );
}
