import React from "react";
import {
  pageInfoClass,
  pageSizeSelectClass,
  pageSizeSelectorClass,
  paginationButtonClass,
  paginationContainerClass,
  paginationControlsClass,
  paginationInfoClass,
} from "./styles.js";

const getPaginationData = (paginatorInfo) => {
  if (!paginatorInfo) return null;

  const currentPage = Number(paginatorInfo.currentPage || 1);
  const lastPage = Number(paginatorInfo.lastPage || 1);
  const total = Number(paginatorInfo.total || 0);
  const perPage = Number(paginatorInfo.perPage || 10);
  const startRecord = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const endRecord = Math.min(currentPage * perPage, total);

  return {
    currentPage,
    lastPage,
    total,
    perPage,
    startRecord,
    endRecord,
  };
};

const Pagination = ({
  paginatorInfo,
  paginationPageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const paginationData = getPaginationData(paginatorInfo);

  if (!paginationData) return null;

  const { currentPage, lastPage, total, perPage, startRecord, endRecord } =
    paginationData;

  const handlePrevious = () => {
    if (currentPage > 1 && typeof onPageChange === "function") {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < lastPage && typeof onPageChange === "function") {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageSizeChange = (event) => {
    const pageSize = Number(event.target.value);
    if (typeof onPageSizeChange === "function") {
      onPageSizeChange(pageSize);
    }
  };

  return (
    <div className={paginationContainerClass}>
      <div className={paginationInfoClass}>
        Showing {startRecord} to {endRecord} of {total} entries
      </div>
      <div className={paginationControlsClass}>
        <span className={pageSizeSelectorClass}>
          Page size:
          <select
            className={pageSizeSelectClass}
            value={paginationPageSize || perPage}
            onChange={handlePageSizeChange}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </span>

        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={paginationButtonClass}
        >
          Previous
        </button>

        <span className={pageInfoClass}>
          Page {currentPage} of {lastPage}
        </span>

        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage === lastPage}
          className={paginationButtonClass}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
