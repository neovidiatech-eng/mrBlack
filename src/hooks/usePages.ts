import { useState, useEffect } from "react";
import { pagesService } from "@/services/pages.service";
import { PageItem } from "@/types/pages";

export function usePages() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPages = async () => {
      try {
        setIsLoading(true);
        const response = await pagesService.getPages();
        if (isMounted && response.success) {
          setPages(response.data);
          setError(null);
        } else if (isMounted) {
          setError("Failed to fetch pages.");
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "An error occurred while fetching pages.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPages();

    return () => {
      isMounted = false;
    };
  }, []);

  return { pages, isLoading, error };
}

export function usePage(slug: string) {
  const [page, setPage] = useState<PageItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!slug) return;

    const fetchPage = async () => {
      try {
        setIsLoading(true);
        const response = await pagesService.getPage(slug);
        if (isMounted && response.success) {
          setPage(response.data);
          setError(null);
        } else if (isMounted) {
          setError("Failed to fetch page.");
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "An error occurred while fetching page.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPage();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return { page, isLoading, error };
}
