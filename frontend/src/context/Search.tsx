import router from "next/router";
import {
  FormEvent,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface Search {
  query: string;
  searched_at?: Date;
  source?: "mic" | "text";
}

const SearchContext = createContext(
  {} as {
    onSearch: (searchWord?: Search) => void;
    history: Search[];
    searchState: [Search, (search: Search) => void];
  }
);

export default SearchContext;

export function SearchProvider({ children }: any) {
  const [history, setHistory] = useState<Search[]>([]);
  const [search, setSearch] = useState<Search>({
    query: "",
  });
  const addSearch = (search: Search) => {
    if (history.some((item) => item.query === search.query)) return;
    const newHistory = [
      ...history,
      {
        ...search,
        searched_at: new Date(),
      },
    ];
    localStorage.setItem("history_search", JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  const onSearch = (searchWord?: Search) => {
    if (!searchWord?.query && !search.query) {
      setSearch({ query: "Ask anything you want!" });
      return;
    }
    if (!searchWord) searchWord = search;

    addSearch(searchWord);
    searchWord;
    router.push({
      pathname: "/results",
      query: { search: searchWord.query },
    });
  };

  useEffect(() => {
    let history_save = localStorage.getItem("history_search");
    if (history_save) setHistory(JSON.parse(history_save));
  }, []);

  return (
    <SearchContext.Provider
      value={{
        history,
        onSearch,
        searchState: [search, setSearch],
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useTheme must be used within an ThemeProvider");
  }
  return context;
}
