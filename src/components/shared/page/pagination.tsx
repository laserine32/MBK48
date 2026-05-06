"use client";
import { FC } from "react";
import { generatePagination, paginationGenerated } from "@/lib/utils";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { CaretDoubleLeftIcon, CaretDoubleRightIcon } from "@phosphor-icons/react";

interface PaginationProps {
  totalPages: number;
}

const Pagination: FC<PaginationProps> = ({ totalPages }) => {
  const pathname: string = usePathname();
  const searchParams = useSearchParams();
  const currentPage: number = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number): string => {
    const params: URLSearchParams = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages: paginationGenerated = generatePagination(currentPage, totalPages);

  return (
    <>
      <div className="inline-flex">
        <PaginationArrow direction="left" href={createPageURL(currentPage - 1)} isDisabled={currentPage <= 1} />
        <div className="flex -space-x-px">
          {allPages.map((page, index) => {
            let position: Position = undefined;
            if (index === 0) position = "first";
            if (index === allPages.length - 1) position = "last";
            if (allPages.length === 1) position = "single";
            if (page === "...") position = "middle";
            return (
              <PaginationNumber
                key={index}
                href={createPageURL(Number(page))}
                page={`${page}`}
                position={position}
                isActive={currentPage == page}
              />
            );
          })}
        </div>
        <PaginationArrow
          direction="right"
          href={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
        />
      </div>
    </>
  );
};

type Position = "first" | "middle" | "last" | "single" | undefined;

interface PaginationNumberProps {
  page: string;
  href: string;
  position?: Position;
  isActive: boolean;
}

const PaginationNumber: FC<PaginationNumberProps> = ({ page, href, position, isActive }) => {
  const className: string = clsx("linking flex h-10 w-10 items-center justify-center text-sm border border-dialect", {
    "rounded-l-sm": position === "first" || position === "single",
    "rounded-r-sm": position === "last" || position === "single",
    "z-10 bg-primary text-primary-foreground boder-border": isActive,
    "hover:bg-primary hover:text-primary-foreground": !isActive && position !== "middle",
    "text-secondary-foreground pointer-events-none": position === "middle",
  });
  return isActive && position === "middle" ? (
    <div className={className}>{page}</div>
  ) : isActive && position !== undefined ? (
    isActive ? (
      position === undefined ? null : (
        <Link href={href} className={className}>
          {page}
        </Link>
      )
    ) : null
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
};

interface PaginationArrowProps {
  href: string;
  direction: "left" | "right";
  isDisabled: boolean;
}

const PaginationArrow: FC<PaginationArrowProps> = ({ href, direction, isDisabled }) => {
  const className: string = clsx(
    "linking flex h-10 w-10 items-center justify-center text-sm border border-dialect rounded-sm",
    {
      "pointer-events-none text-muted-foreground": isDisabled,
      "hover:bg-primary hover:text-primary-foreground": !isDisabled,
      "mr-2": direction === "left",
      "ml-2": direction === "right",
    }
  );
  const icon =
    direction === "left" ? <CaretDoubleLeftIcon className="size-6" /> : <CaretDoubleRightIcon className="size-6" />;
  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link href={href} className={className}>
      {icon}
    </Link>
  );
};

export default Pagination;
