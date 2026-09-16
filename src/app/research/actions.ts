"use server";

import { getPapersList, type PaperFilters } from "@/lib/queries";

export async function loadMorePapers(filters: PaperFilters) {
  return getPapersList(filters);
}
