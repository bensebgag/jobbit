"use client";

import Container from "../components/layout/Container";
import SearchBar from "@/components/ui/SearchBar";
import SetJobsSection from "@/components/layout/SetJobsSection";
import CurrentTechnolgies from "@/components/layout/CurrentTechnolgies";
import AboutUs from "@/components/layout/AboutUs";
import Footer from "@/components/layout/Footer";
import Navigation from "@/components/ui/Navigation";
import { KeyWordsContextProvider } from "@/contextes/KeyWordsContext";
import { Toaster } from "react-hot-toast";
import Lottie from "lottie-react";
import animationHero from "../../public/AnimationHeroSection.json";
import { useGetUser } from "@/hooks/useGetUser";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function Home() {
  const { user } = useGetUser();
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navigation />
      <Container
        styleElement={
          "flex flex-col md:flex-row items-center justify-between mt-10 md:mt-20 px-4 md:px-6"
        }
      >
        <div
          className={
            "flex flex-col w-1/2  items-center md:items-start gap-6 pr-10 order-2 md:order-1 text-center md:text-left"
          }
        >
          <h1
            className={
              "text-gray-950 leading-15 font-bold text-3xl md:text-4xl lg:text-5xl"
            }
          >
            Promote and Calorize{" "}
            <span className={"text-blue-600"}>IT talents </span> in Algeria
          </h1>
          <p className={"text-gray-950 font-medium text-base md:text-lg"}>
            JoBBit is the reference of IT recrutmenet in Algeria. We help the
            candidates and the companies to find the perfect match
          </p>
          <div className="flex items-center gap-4 mt-4">
            {!user ? ( // User is NOT authenticated
              <>
                <Button
                  className={
                    "bg-green-700 text-white font-medium hover:cursor-pointer hover:bg-green-600"
                  }
                  onClick={() => router.push("/auth")}
                >
                  Apply
                </Button>
                <Button
                  className={
                    "bg-white border-[1px] border-gray-400 text-gray-950 font-medium hover:cursor-pointer hover:bg-gray-50"
                  }
                  onClick={() => router.push("/auth")}
                >
                  Publish a job offer
                </Button>
              </>
            ) : user.role === "JobSeeker" ? ( // Authenticated as JobSeeker
              <Button
                className={
                  "bg-green-700 text-white font-medium hover:cursor-pointer hover:bg-green-600"
                }
                onClick={() =>
                  sectionRef.current?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Apply
              </Button>
            ) : user.role === "Company" ? ( // Authenticated as Company
              <Button
                className={
                  "bg-white border-[1px] border-gray-400 text-gray-950 font-medium hover:cursor-pointer hover:bg-gray-50"
                }
                onClick={() => router.push("/job-offer/new")}
              >
                Publish a job offer
              </Button>
            ) : null}{" "}
          </div>
        </div>
        <Lottie
          className={
            "w-full md:w-[45%] lg:w-[40%] mb-8 md:mb-0 order-1 md:order-2"
          }
          animationData={animationHero}
          loop={true}
        />
      </Container>
      <KeyWordsContextProvider>
        <SearchBar />
        <SetJobsSection ref={sectionRef} />
      </KeyWordsContextProvider>
      <Toaster />
      <CurrentTechnolgies />
      <AboutUs />
      <Footer />
    </div>
  );
}
