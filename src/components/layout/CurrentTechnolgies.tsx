import Container from "@/components/layout/Container";
import Image from "next/image";
import javascript from "@/../public/js_5968292.png";

export default function CurrentTechnolgies() {
  const arr = Array.from({ length: 12 });

  return (
    <Container styleElement={"mt-10 sm:mt-16 md:mt-20 py-8"}>
      <div className={"flex flex-col gap-6 sm:gap-8"}>
        <h2
          className={"text-center text-gray-950 font-bold text-2xl sm:text-3xl"}
        >
          Current Technologies
        </h2>
        <div
          className={
            "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 justify-items-center"
          }
        >
          {arr.map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <Image
                className={
                  "w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full"
                }
                src={javascript}
                alt={"JavaScript"}
              />
              <p
                className={
                  "text-gray-950 font-medium text-sm sm:text-base md:text-lg mt-2"
                }
              >
                JavaScript
              </p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
