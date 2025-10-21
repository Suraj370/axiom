import { useEffect, useState } from "react";
import { PAGINATION } from "@/constants/pagination";

interface UseEntitySearchProps<T extends { 
  search: string;
  page: number;
}> {
  params: T;
  setParams: (params: T) => void;
  debounceMs?: number;
}

export function useEntitySearch<T extends {
  search: string;
  page: number;
}>({
  params,
  setParams,
  debounceMs = 500,
}: UseEntitySearchProps<T>) {
  const [localSearch, setLocalSearch] = useState(params.search);

  // Sync local input with external param changes
  useEffect(() => {
    setLocalSearch(params.search);
  }, [params.search]);

  // Debounce search updates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (params.search !== localSearch) {
        setParams({
          ...params,
          search: localSearch,
          page: PAGINATION.DEFAULT_PAGE,
        });
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localSearch, params.search, setParams, debounceMs]);

  return {
    searchValue: localSearch,
    onSearchChange: setLocalSearch,
  };
}
