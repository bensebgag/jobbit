"use client";
import { useState, useMemo, RefObject } from "react";
import Container from "@/components/layout/Container";
import { useKeyWords } from "@/contextes/KeyWordsContext";
import { motion } from "motion/react";
import JobCard from "../ui/JobCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatDate } from "@/utils/helper";
import Spinner from "../ui/Spinner";

export default function SetJobsSection({
  ref,
}: {
  ref: RefObject<HTMLDivElement | null>;
}) {
  const { dataFilter: cards, isLoading } = useKeyWords();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Calculate total pages
  const totalPages = useMemo(() => {
    return cards ? Math.ceil(cards.length / ITEMS_PER_PAGE) : 0;
  }, [cards]);

  // Get current cards for the page
  const currentCards = useMemo(() => {
    if (!cards) return [];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return cards.slice(startIndex, endIndex);
  }, [cards, currentPage]);

  // Handle page changes
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of the section when changing pages
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Number of pages to show in pagination

    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are fewer than maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate range around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust range if at the beginning or end
      if (currentPage <= 2) {
        endPage = 4;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push("ellipsis1");
      }

      // Add pages in the range
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis2");
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <Container
      ref={ref}
      styleElement="mt-10 md:mt-20 flex flex-col gap-4 md:gap-6"
    >
      {isLoading ? (
        <div className="flex items-center justify-center w-full py-10">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
            {currentCards.map((item, index) => (
              <motion.div
                key={item.jobID || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <JobCard
                  item={item}
                  jobId={item.jobID}
                  image={item.logoPath}
                  title={item.title}
                  siklsImages={item.skillsIconUrl}
                  location={item.wilayaName}
                  nameCampny={item.companyName}
                  date={formatDate(item.postedDate)}
                />
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 md:mt-10">
              <Pagination>
                <PaginationContent className="flex flex-wrap justify-center gap-1 md:gap-0">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => goToPage(currentPage - 1)}
                      className={`text-xs md:text-sm ${
                        currentPage === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      tabIndex={currentPage === 1 ? -1 : 0}
                    />
                  </PaginationItem>

                  {/* Show fewer page numbers on small screens */}
                  {getPageNumbers().map((pageNum, idx) => {
                    // On small screens, only show current page, first and last
                    const isSmallScreenHidden =
                      typeof window !== "undefined" &&
                      window.innerWidth < 640 &&
                      typeof pageNum === "number" &&
                      pageNum !== 1 &&
                      pageNum !== currentPage &&
                      pageNum !== totalPages;

                    if (isSmallScreenHidden) return null;

                    return typeof pageNum === "string" ? (
                      <PaginationItem
                        key={`ell-${idx}`}
                        className="hidden sm:flex"
                      >
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => goToPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer text-xs md:text-sm h-8 w-8 md:h-10 md:w-10"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => goToPage(currentPage + 1)}
                      className={`text-xs md:text-sm ${
                        currentPage === totalPages
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      tabIndex={currentPage === totalPages ? -1 : 0}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </Container>
  );
}
