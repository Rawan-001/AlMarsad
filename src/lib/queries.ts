import { unstable_cache } from "next/cache";
import { query, queryOne } from "./db";

// This dataset only changes when the ETL is re-run manually (see
// db/build_database.py), never from user traffic. Wrapping read queries in
// unstable_cache lets Vercel's Data Cache serve them without a round trip to
// Postgres (which sits in a different region from the deployed functions),
// while individual pages stay dynamically rendered per-request for the
// cookie-based locale switch.
const HOUR = 3600;
const DAY = 86400;

export type DashboardStats = {
  totalPapers: number;
  institutionTotal: number;
  sharePct: number;
  totalCitations: number;
  meanCitations: number;
  papersSince2020: number;
  openAccessCount: number;
  openAccessPct: number;
  authorNamesCount: number;
  docTypeArticles: number;
  docTypeReviews: number;
  docTypeProceedings: number;
};

export const getDashboardStats = unstable_cache(
  async (): Promise<DashboardStats> => {
    const [row, inst, authorsRow] = await Promise.all([
      queryOne<{
        total_papers: string;
        wos_papers: string;
        total_citations: string | null;
        since_2020: string;
        open_access: string;
        doc_articles: string;
        doc_reviews: string;
        doc_proceedings: string;
      }>(`
        SELECT
          COUNT(*) AS total_papers,
          COUNT(*) FILTER (WHERE wos_uid IS NOT NULL) AS wos_papers,
          SUM(citations_wos) AS total_citations,
          COUNT(*) FILTER (WHERE year >= 2020) AS since_2020,
          COUNT(*) FILTER (WHERE open_access IS NOT NULL) AS open_access,
          COUNT(*) FILTER (WHERE document_type IN ('Article', 'Article; Early Access', 'Article; Proceedings Paper')) AS doc_articles,
          COUNT(*) FILTER (WHERE document_type = 'Review') AS doc_reviews,
          COUNT(*) FILTER (WHERE document_type = 'Proceedings Paper') AS doc_proceedings
        FROM paper
        WHERE include_in_display
      `),
      queryOne<{ wos_total: number }>(`SELECT wos_total FROM institution_stats WHERE id = 1`),
      queryOne<{ count: string }>(`
        SELECT COUNT(DISTINCT name_as_written) AS count
        FROM researcher_paper
        WHERE include_in_display AND NOT mega_consortium
      `),
    ]);

    const totalPapers = Number(row?.total_papers ?? 0);
    const wosPapers = Number(row?.wos_papers ?? 0);
    const totalCitations = Number(row?.total_citations ?? 0);
    const institutionTotal = inst?.wos_total ?? 0;
    const openAccessCount = Number(row?.open_access ?? 0);

    return {
      totalPapers,
      institutionTotal,
      // Share is WoS-specific: institutionTotal (5,271) is a WoS institutional
      // total, so the numerator must only count WoS-sourced papers, not the
      // full merged (WoS + Scopus) total, or the ratio would be meaningless.
      sharePct: institutionTotal ? (wosPapers / institutionTotal) * 100 : 0,
      totalCitations,
      meanCitations: totalPapers ? totalCitations / totalPapers : 0,
      papersSince2020: Number(row?.since_2020 ?? 0),
      openAccessCount,
      openAccessPct: totalPapers ? (openAccessCount / totalPapers) * 100 : 0,
      authorNamesCount: Number(authorsRow?.count ?? 0),
      docTypeArticles: Number(row?.doc_articles ?? 0),
      docTypeReviews: Number(row?.doc_reviews ?? 0),
      docTypeProceedings: Number(row?.doc_proceedings ?? 0),
    };
  },
  ["dashboard-stats"],
  { revalidate: HOUR }
);

export type YearCount = { year: number; count: number; partial: boolean };

export const getYearCounts = unstable_cache(
  async (minYear?: number): Promise<YearCount[]> => {
    const rows = await query<{ year: number; count: string }>(
      `SELECT year, COUNT(*) AS count
       FROM paper
       WHERE include_in_display AND year IS NOT NULL ${minYear ? "AND year >= $1" : ""}
       GROUP BY year
       ORDER BY year`,
      minYear ? [minYear] : []
    );
    const currentYear = new Date().getFullYear();
    return rows.map((r) => ({ year: r.year, count: Number(r.count), partial: r.year >= currentYear }));
  },
  ["year-counts"],
  { revalidate: HOUR }
);

export type BranchCount = { code: string; nameEn: string; count: number };

export const getBranchCounts = unstable_cache(
  async (): Promise<BranchCount[]> => {
    const rows = await query<{ code: string; name_en: string; count: string }>(`
      SELECT b.code, b.name_en, COUNT(*) AS count
      FROM paper_branch pb
      JOIN ai_branch b ON b.branch_id = pb.branch_id
      JOIN paper p ON p.paper_id = pb.paper_id
      WHERE p.include_in_display AND b.code != 'tier_c'
      GROUP BY b.code, b.name_en
      HAVING COUNT(*) > 0
      ORDER BY count DESC
    `);
    return rows.map((r) => ({ code: r.code, nameEn: r.name_en, count: Number(r.count) }));
  },
  ["branch-counts"],
  { revalidate: HOUR }
);

export type CollegeGroupCount = { collegeGroup: string; count: number };

export const getCollegeGroupCounts = unstable_cache(
  async (): Promise<CollegeGroupCount[]> => {
    const rows = await query<{ college_group: string; paper_count: number }>(
      `SELECT college_group, paper_count FROM college_group_summary ORDER BY paper_count DESC`
    );
    return rows.map((r) => ({ collegeGroup: r.college_group, count: Number(r.paper_count) }));
  },
  ["college-group-counts"],
  { revalidate: HOUR }
);

export type DomainCount = { domain: string; count: number };

export const getApplicationDomainCounts = unstable_cache(
  async (): Promise<DomainCount[]> => {
    const rows = await query<{ application_domain: string; count: string }>(`
      SELECT application_domain, COUNT(*) AS count
      FROM paper
      WHERE include_in_display AND application_domain IS NOT NULL
      GROUP BY application_domain
      ORDER BY count DESC
    `);
    return rows.map((r) => ({ domain: r.application_domain, count: Number(r.count) }));
  },
  ["application-domain-counts"],
  { revalidate: HOUR }
);

export type DocTypeCount = { docType: string; count: number };

export const getDocumentTypeCounts = unstable_cache(
  async (): Promise<DocTypeCount[]> => {
    const rows = await query<{ document_type: string; count: string }>(`
      SELECT document_type, COUNT(*) AS count
      FROM paper
      WHERE include_in_display AND document_type IS NOT NULL
      GROUP BY document_type
      ORDER BY count DESC
    `);
    return rows.map((r) => ({ docType: r.document_type, count: Number(r.count) }));
  },
  ["document-type-counts"],
  { revalidate: HOUR }
);

export const getBranchOptions = unstable_cache(
  async (): Promise<{ code: string; nameEn: string }[]> => {
    const rows = await query<{ code: string; name_en: string }>(
      `SELECT code, name_en FROM ai_branch ORDER BY name_en`
    );
    return rows.map((r) => ({ code: r.code, nameEn: r.name_en }));
  },
  ["branch-options"],
  { revalidate: DAY }
);

export const getApplicationDomainOptions = unstable_cache(
  async (): Promise<string[]> => {
    const rows = await query<{ application_domain: string }>(
      `SELECT DISTINCT application_domain FROM paper
       WHERE include_in_display AND application_domain IS NOT NULL
       ORDER BY application_domain`
    );
    return rows.map((r) => r.application_domain);
  },
  ["application-domain-options"],
  { revalidate: DAY }
);

export const getDocumentTypeOptions = unstable_cache(
  async (): Promise<string[]> => {
    const rows = await query<{ document_type: string }>(
      `SELECT DISTINCT document_type FROM paper
       WHERE include_in_display AND document_type IS NOT NULL
       ORDER BY document_type`
    );
    return rows.map((r) => r.document_type);
  },
  ["document-type-options"],
  { revalidate: DAY }
);

export type DataSource = "wos" | "scopus" | "both";

export type PaperListItem = {
  paperId: number;
  title: string;
  year: number | null;
  sourceTitle: string | null;
  citations: number | null;
  doi: string | null;
  documentType: string | null;
  isMegaConsortium: boolean;
  branches: string[];
  dataSource: DataSource;
};

function toDataSource(hasWos: boolean, hasScopus: boolean): DataSource {
  if (hasWos && hasScopus) return "both";
  return hasWos ? "wos" : "scopus";
}

export type PaperFilters = {
  q?: string;
  branch?: string;
  domain?: string;
  docType?: string;
  year?: string;
  sort?: "recent" | "cited";
  page: number;
  pageSize: number;
};

export async function getPapersList(
  filters: PaperFilters
): Promise<{ items: PaperListItem[]; total: number }> {
  const conditions = ["p.include_in_display"];
  const params: unknown[] = [];

  if (filters.q) {
    params.push(`%${filters.q}%`);
    conditions.push(`p.title ILIKE $${params.length}`);
  }
  if (filters.year) {
    params.push(Number(filters.year));
    conditions.push(`p.year = $${params.length}`);
  }
  if (filters.docType) {
    params.push(filters.docType);
    conditions.push(`p.document_type = $${params.length}`);
  }
  if (filters.domain) {
    params.push(filters.domain);
    conditions.push(`p.application_domain = $${params.length}`);
  }
  if (filters.branch) {
    params.push(filters.branch);
    conditions.push(`EXISTS (
      SELECT 1 FROM paper_branch pb2
      JOIN ai_branch b2 ON b2.branch_id = pb2.branch_id
      WHERE pb2.paper_id = p.paper_id AND b2.code = $${params.length}
    )`);
  }

  const where = `WHERE ${conditions.join(" AND ")}`;
  const orderBy =
    filters.sort === "cited"
      ? "p.citations_wos DESC NULLS LAST, p.year DESC, p.paper_id DESC"
      : "p.year DESC NULLS LAST, p.citations_wos DESC, p.paper_id DESC";
  const offset = (filters.page - 1) * filters.pageSize;
  const listParams = [...params, filters.pageSize, offset];

  const [totalRow, rows] = await Promise.all([
    queryOne<{ count: string }>(`SELECT COUNT(*) AS count FROM paper p ${where}`, params),
    query<{
      paper_id: number;
      title: string;
      year: number | null;
      source_title: string | null;
      citations_wos: number | null;
      doi: string | null;
      document_type: string | null;
      mega_consortium: boolean;
      branches: string[] | null;
      has_wos: boolean;
      has_scopus: boolean;
    }>(
      `SELECT p.paper_id, p.title, p.year, p.source_title, p.citations_wos, p.doi, p.document_type, p.mega_consortium,
         (p.wos_uid IS NOT NULL) AS has_wos, (p.scopus_eid IS NOT NULL) AS has_scopus,
         ARRAY(
           SELECT b.name_en FROM paper_branch pb
           JOIN ai_branch b ON b.branch_id = pb.branch_id
           WHERE pb.paper_id = p.paper_id
         ) AS branches
       FROM paper p
       ${where}
       ORDER BY ${orderBy}
       LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
      listParams
    ),
  ]);

  return {
    items: rows.map((r) => ({
      paperId: r.paper_id,
      title: r.title,
      year: r.year,
      sourceTitle: r.source_title,
      citations: r.citations_wos,
      doi: r.doi,
      documentType: r.document_type,
      isMegaConsortium: r.mega_consortium,
      branches: r.branches ?? [],
      dataSource: toDataSource(r.has_wos, r.has_scopus),
    })),
    total: Number(totalRow?.count ?? 0),
  };
}

export type PaperDetail = PaperListItem & {
  applicationDomain: string | null;
  abstract: string | null;
  researchers: { nameKey: string; displayName: string }[];
};

export const getPaperDetail = unstable_cache(
  async (paperId: number): Promise<PaperDetail | null> => {
    const row = await queryOne<{
      paper_id: number;
      title: string;
      year: number | null;
      source_title: string | null;
      citations_wos: number | null;
      doi: string | null;
      document_type: string | null;
      mega_consortium: boolean;
      application_domain: string | null;
      abstract: string | null;
      has_wos: boolean;
      has_scopus: boolean;
    }>(
      `SELECT paper_id, title, year, source_title, citations_wos, doi, document_type, mega_consortium,
              application_domain, abstract, (wos_uid IS NOT NULL) AS has_wos, (scopus_eid IS NOT NULL) AS has_scopus
       FROM paper WHERE paper_id = $1 AND include_in_display`,
      [paperId]
    );
    if (!row) return null;

    const [branchRows, researcherRows] = await Promise.all([
      query<{ name_en: string }>(
        `SELECT b.name_en FROM paper_branch pb
         JOIN ai_branch b ON b.branch_id = pb.branch_id
         WHERE pb.paper_id = $1`,
        [paperId]
      ),
      query<{ name_key: string; name_as_written: string }>(
        `SELECT DISTINCT name_key, name_as_written FROM researcher_paper
         WHERE paper_id = $1 AND include_in_display
         ORDER BY name_as_written`,
        [paperId]
      ),
    ]);

    return {
      paperId: row.paper_id,
      title: row.title,
      year: row.year,
      sourceTitle: row.source_title,
      citations: row.citations_wos,
      doi: row.doi,
      documentType: row.document_type,
      isMegaConsortium: row.mega_consortium,
      branches: branchRows.map((b) => b.name_en),
      dataSource: toDataSource(row.has_wos, row.has_scopus),
      applicationDomain: row.application_domain,
      abstract: row.abstract,
      researchers: researcherRows.map((r) => ({ nameKey: r.name_key, displayName: r.name_as_written })),
    };
  },
  ["paper-detail"],
  { revalidate: DAY }
);

export type ResearcherListItem = {
  nameKey: string;
  displayName: string;
  departments: string[];
  paperCount: number;
};

export async function getResearcherList(
  q: string | undefined,
  page: number,
  pageSize: number
): Promise<{ items: ResearcherListItem[]; total: number }> {
  const conditions = ["include_in_display", "NOT mega_consortium"];
  const params: unknown[] = [];
  if (q) {
    params.push(`%${q}%`);
    conditions.push(`name_key IN (
      SELECT DISTINCT name_key FROM researcher_paper WHERE name_as_written ILIKE $${params.length}
    )`);
  }
  const where = `WHERE ${conditions.join(" AND ")}`;
  const offset = (page - 1) * pageSize;
  const listParams = [...params, pageSize, offset];

  const [totalRow, rows] = await Promise.all([
    queryOne<{ count: string }>(`SELECT COUNT(DISTINCT name_key) AS count FROM researcher_paper ${where}`, params),
    query<{ name_key: string; display_name: string; paper_count: string; departments: string[] | null }>(
      `SELECT name_key,
            (
              SELECT name_as_written FROM researcher_paper rp2
              WHERE rp2.name_key = rp.name_key AND rp2.include_in_display AND NOT rp2.mega_consortium
              GROUP BY name_as_written ORDER BY COUNT(*) DESC, MIN(rp2.id) LIMIT 1
            ) AS display_name,
            COUNT(DISTINCT paper_id) AS paper_count,
            ARRAY(
              SELECT DISTINCT department_short FROM researcher_paper rp3
              WHERE rp3.name_key = rp.name_key AND rp3.include_in_display AND NOT rp3.mega_consortium
                AND rp3.department_short IS NOT NULL
            ) AS departments
     FROM researcher_paper rp
     ${where}
     GROUP BY name_key
     ORDER BY paper_count DESC, display_name, name_key
     LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
      listParams
    ),
  ]);

  return {
    items: rows.map((r) => ({
      nameKey: r.name_key,
      displayName: r.display_name,
      departments: r.departments ?? [],
      paperCount: Number(r.paper_count),
    })),
    total: Number(totalRow?.count ?? 0),
  };
}

export type ResearcherDetail = {
  nameKey: string;
  displayName: string;
  departments: string[];
  branches: string[];
  papers: { paperId: number; title: string; year: number | null }[];
};

export const getResearcherDetail = unstable_cache(
  async (nameKey: string): Promise<ResearcherDetail | null> => {
    const [nameRow, deptRows, branchRows, paperRows] = await Promise.all([
      queryOne<{ display_name: string }>(
        `SELECT name_as_written AS display_name FROM researcher_paper
         WHERE name_key = $1 AND include_in_display AND NOT mega_consortium
         GROUP BY name_as_written ORDER BY COUNT(*) DESC, MIN(id) LIMIT 1`,
        [nameKey]
      ),
      query<{ department_short: string }>(
        `SELECT DISTINCT department_short FROM researcher_paper
         WHERE name_key = $1 AND include_in_display AND NOT mega_consortium AND department_short IS NOT NULL`,
        [nameKey]
      ),
      query<{ name_en: string }>(
        `SELECT DISTINCT b.name_en
         FROM researcher_paper rp
         JOIN paper_branch pb ON pb.paper_id = rp.paper_id
         JOIN ai_branch b ON b.branch_id = pb.branch_id
         WHERE rp.name_key = $1 AND rp.include_in_display AND NOT rp.mega_consortium`,
        [nameKey]
      ),
      query<{ paper_id: number; title: string; year: number | null }>(
        `SELECT DISTINCT p.paper_id, p.title, p.year
         FROM researcher_paper rp
         JOIN paper p ON p.paper_id = rp.paper_id
         WHERE rp.name_key = $1 AND rp.include_in_display AND NOT rp.mega_consortium
         ORDER BY p.year DESC NULLS LAST`,
        [nameKey]
      ),
    ]);
    if (!nameRow) return null;

    return {
      nameKey,
      displayName: nameRow.display_name,
      departments: deptRows.map((d) => d.department_short),
      branches: branchRows.map((b) => b.name_en),
      papers: paperRows.map((p) => ({ paperId: p.paper_id, title: p.title, year: p.year })),
    };
  },
  ["researcher-detail"],
  { revalidate: DAY }
);

export const getResearcherApproxCount = unstable_cache(
  async (): Promise<number> => {
    const row = await queryOne<{ count: string }>(`
      SELECT COUNT(DISTINCT name_as_written) AS count
      FROM researcher_paper
      WHERE include_in_display AND NOT mega_consortium
    `);
    return Number(row?.count ?? 0);
  },
  ["researcher-approx-count"],
  { revalidate: HOUR }
);
