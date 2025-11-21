'use client';

import { cn } from '@/lib/utils';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showPageNumbers?: boolean;
    className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    showPageNumbers = true,
    className,
}) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];
        const showEllipsis = totalPages > 7;

        if (!showEllipsis) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push('ellipsis');
            }

            // Show pages around current
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('ellipsis');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <nav
            className={cn('flex items-center justify-center gap-1', className)}
            aria-label="Pagination"
        >
            {/* Previous button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={cn(
                    'p-2 rounded-lg transition-all duration-200',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500'
                )}
                aria-label="Page précédente"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Page numbers */}
            {showPageNumbers && (
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) =>
                        page === 'ellipsis' ? (
                            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                                ...
                            </span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={cn(
                                    'min-w-[2.5rem] h-10 px-3 rounded-lg font-medium transition-all duration-200',
                                    'focus:outline-none focus:ring-2 focus:ring-blue-500',
                                    page === currentPage
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                )}
                                aria-current={page === currentPage ? 'page' : undefined}
                            >
                                {page}
                            </button>
                        )
                    )}
                </div>
            )}

            {/* Next button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={cn(
                    'p-2 rounded-lg transition-all duration-200',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500'
                )}
                aria-label="Page suivante"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </nav>
    );
};

// Hook for pagination logic
export const usePagination = <T,>(items: T[], itemsPerPage: number = 10) => {
    const totalPages = Math.ceil(items.length / itemsPerPage);

    const getPageItems = (page: number): T[] => {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return items.slice(start, end);
    };

    return {
        totalPages,
        getPageItems,
        itemsPerPage,
    };
};

export default Pagination;
