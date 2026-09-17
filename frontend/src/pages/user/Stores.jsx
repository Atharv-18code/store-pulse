import { useState, useEffect, useCallback } from "react";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import RatingStars from "../../components/RatingStars";
import { useToast } from "../../components/Toast";
import api from "../../services/api";
import { MapPin, Star } from "lucide-react";

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [submitting, setSubmitting] = useState(null);
  const [pendingRatings, setPendingRatings] = useState({});
  const toast = useToast();
  const limit = 12;

  const load = useCallback(() => {
    setLoading(true);
    api
      .get("/stores", { params: { search, page, limit } })
      .then((r) => {
        setStores(r.data.stores);
        setTotal(r.data.total);
      })
      .finally(() => setLoading(false));
  }, [search, page]);

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleRate = async (store) => {
    const rating = pendingRatings[store.id];
    if (!rating) {
      toast("error", "Please select a rating first");
      return;
    }
    setSubmitting(store.id);
    try {
      if (store.myRating) {
        await api.put(`/ratings/${store.id}`, { rating });
        toast("success", "Rating updated!");
      } else {
        await api.post("/ratings", { storeId: store.id, rating });
        toast("success", "Rating submitted!");
      }
      load();
      setPendingRatings((p) => {
        const n = { ...p };
        delete n[store.id];
        return n;
      });
    } catch (err) {
      toast("error", err.response?.data?.message || "Failed to submit rating");
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Browse Stores</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {total} stores available
        </p>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by name or address..."
      />

      {loading ? (
        <Loading />
      ) : stores.length === 0 ? (
        <EmptyState title="No stores found" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {stores.map((store) => {
            const pending = pendingRatings[store.id];
            const displayRating = pending ?? store.myRating ?? 0;
            return (
              <div
                key={store.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-slate-900 mb-1 truncate">
                  {store.name}
                </h3>
                {store.address && (
                  <div className="flex items-start gap-1.5 text-xs text-slate-400 mb-3">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span className="truncate">{store.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-4 text-sm text-slate-500">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>
                    {store.avgRating ? store.avgRating.toFixed(2) : "N/A"}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span>{store.totalRatings} ratings</span>
                </div>

                <div className="border-t border-slate-50 pt-4">
                  <p className="text-xs font-medium text-slate-400 mb-2">
                    {store.myRating ? "Your rating" : "Rate this store"}
                  </p>
                  <RatingStars
                    value={displayRating}
                    onChange={(v) =>
                      setPendingRatings((p) => ({ ...p, [store.id]: v }))
                    }
                  />
                  {(pending || !store.myRating) && pending !== undefined && (
                    <button
                      onClick={() => handleRate(store)}
                      disabled={submitting === store.id}
                      className="mt-3 w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-medium rounded-lg transition"
                    >
                      {submitting === store.id
                        ? "Submitting..."
                        : store.myRating
                          ? "Update Rating"
                          : "Submit Rating"}
                    </button>
                  )}
                  {!pending && store.myRating ? (
                    <button
                      onClick={() =>
                        setPendingRatings((p) => ({
                          ...p,
                          [store.id]: store.myRating,
                        }))
                      }
                      className="mt-3 w-full py-1.5 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition"
                    >
                      Modify Rating
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-center">
        <Pagination
          page={page}
          totalPages={Math.ceil(total / limit)}
          onPage={setPage}
        />
      </div>
    </div>
  );
}
