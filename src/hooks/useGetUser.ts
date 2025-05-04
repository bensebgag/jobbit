import { useState, useEffect } from "react";
import { AuthCompanyResponse, AuthJobSeekerResponse } from "@/utils/types";

// 1. Extend both response types with a `role` discriminator
type StoredUser =
  | (AuthCompanyResponse & { role: "Company" })
  | (AuthJobSeekerResponse & { role: "JobSeeker" });

// 2. Define the return shape of the hook
interface UseGetUserResult {
  user: StoredUser | null;
  companyId?: number;
  userId?: number;
}

// In useGetUser hook
export function useGetUser(): UseGetUserResult {
  const [user, setUser] = useState<StoredUser | null>(null);

  // Unified storage check
  const checkStorage = () => {
    const raw = localStorage.getItem("user");
    if (!raw) {
      setUser(null);
      return;
    }
    try {
      const parsed = JSON.parse(raw) as StoredUser;
      setUser(parsed);
    } catch (e) {
      console.error("Invalid user data", e);
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    // Initial check
    checkStorage();

    // Listen for custom event (same tab) + storage event (other tabs)
    const handleStorageChange = () => checkStorage();

    window.addEventListener("local-storage-change", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("local-storage-change", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return {
    user,
    companyId:
      user?.role === "Company" ? user.allCompanyInfo.companyID : undefined,
    userId:
      user?.role === "JobSeeker"
        ? user.allJobSeekerInfo.jobSeekerID
        : undefined,
  };
}
