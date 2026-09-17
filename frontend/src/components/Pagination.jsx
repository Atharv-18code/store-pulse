import { ChevronLeft, ChevronRight } from "lucide-react";
export default function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );
  return (
    <nav aria-label="Pagination" className="flex items-center gap-1">
      <button
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onPage(page - 1)}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p, i) => (
        <span key={p}>
          {i > 0 && p - pages[i - 1] > 1 && (
            <span className="px-1 text-slate-400">…</span>
          )}
          <button
            onClick={() => onPage(p)}
            className={`h-8 min-w-8 rounded-lg px-2 text-sm ${p === page ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            {p}
          </button>
        </span>
      ))}
      <button
        aria-label="Next page"
        disabled={page === totalPages}
        onClick={() => onPage(page + 1)}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
