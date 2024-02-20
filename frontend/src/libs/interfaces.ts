import { Message } from "@/components/Banner";
import { Search } from "@/context/Search";

export interface Keyword {
  text: string;
  dbpedia_resource?: string;
}

export interface WebKeyword {
  position: number;
  knowledge: null;
  keyword_html: string;
  keyword: string;
}

export interface WebRelatedKeywords {
  spelling_suggestion_html: null;
  spelling_suggestion: null;
  keywords: WebKeyword[];
}

export interface Result {
  position: number;
  url: string;
  title: string;
  description: string;
  rating?: number;
  reading_time?: number;
}

export interface SearchData {
  search_term: string;
  knowledge_panel: null;
  results: Result[];
  related_keywords: WebRelatedKeywords;
}

export interface ListComponent {
  id: string;
  style?: React.CSSProperties;
  search: string;
  isLoadingInitialData: boolean;
  info?: Message;
  cardComponent: React.FC<any>;
  filterValues?: FilterFields;
  orderByOptions?: any;
  getMorePages: (
    query: string,
    page: number,
    filterValues?: any
  ) => Promise<Page<Result>>;
}

export interface Page<T> {
  data: T[];
  total: number;
  took: number;
  hasNext?: boolean;
}

export interface FilterFields {
  sortBy: "relevance" | "date" | "access";
  orderBy: "asc" | "desc";
  sinceYear: number;
}

//{sortBy: 'relevance', order: 'left', sinceYear: 2023}