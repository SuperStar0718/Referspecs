import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Result,
  Page,
  WebRelatedKeywords,
  SearchData,
} from "../libs/interfaces";
import { Pagination, CircularProgress, List, Typography } from "@mui/material";
// import { getImoveisByFilterWithPage } from "../../../lib/imovel";
import { ListComponent } from "../libs/interfaces";
import useDeviceDetect from "@/hook/useDetectDevice";
import styled from "styled-components";
import { searchWithPage } from "@/libs/result";
import { useTheme } from "@/context/Theme";
import ResultListSkeleton from "./ResultListSkeleton";
import Banner from "./Banner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import Keyword from "./Keyword";

export default function PageButtonList({
  search,
  cardComponent: CardComponent,
  filterValues,
  getMorePages,
  style,
  info,
  id,
}: ListComponent) {
  const { theme } = useTheme();
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchData, setSearchData] = useState<SearchData | null>(null);

  const { data: page } = useQuery(
    ["search", search, pageNumber, filterValues],
    () => getMorePages(search, pageNumber, filterValues)
  );

  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: "GET",
        url: "https://google-search74.p.rapidapi.com/",
        params: {
          query: search,
          limit: "30",
          related_keywords: "true",
        },
        headers: {
          "X-RapidAPI-Key":
            "8d389582c2msh17c72135c674518p1e2321jsna525289b55d0",
          "X-RapidAPI-Host": "google-search74.p.rapidapi.com",
        },
      };

      try {
        setIsLoading(true);
        const response = await axios.request(options);
        console.log(response.data, "response.data");
        setSearchData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [search]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);
  const { isMobileView } = useDeviceDetect();

  return (
    <ListContainer isMobile={isMobileView} style={style} id={id}>
      {/* {info && <Banner message={info} />} */}
      {/* {!isLoading && (page?.data.length || 0) > 0 && (
        <MetadataSearchContainer
          variant="caption"
          color={theme?.colors.text_secondary}
          style={{
            padding: isMobileView ? "0 10px" : "0",
          }}
        >
          {page?.total} resultados em aproximadamente {page?.took} segundos
        </MetadataSearchContainer>
      )} */}

      {isLoading ? (
        <ResultListSkeleton />
      ) : (
        <List
          style={{
            padding: "10px 0",
          }}
        >
          {searchData && (
            <>
              <KeyWordsBox>
                {searchData?.related_keywords.keywords.map((keyword, index) => (
                  <Keyword
                    key={index}
                    index={index}
                    keyword={{ text: keyword.keyword, dbpedia_resource: "" }}
                  />
                ))}
              </KeyWordsBox>
              {searchData?.results.map((result, index) => (
                <CardComponent key={index} result={result} />
              ))}
            </>
          )}
          {/* {page?.data.length === 0 && !isLoading && (
            <NoResultContainer variant="body1" color={theme?.colors.text}>
              Nenhum resultado encontrado {":("}
            </NoResultContainer>
          )} */}
        </List>
      )}
      {/* {!!page?.data.length && (
        <PageCentralContainer>
          <Pagination
            sx={{
              "& .MuiPaginationItem-root": {
                color: theme?.colors.text,
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: theme?.colors.section.primary,
                color: theme?.colors.text,
              },
              "& .MuiPaginationItem-root.Mui-selected:hover": {
                backgroundColor: theme?.colors.section.primary,
                color: theme?.colors.text,
              },
            }}
            count={Math.ceil(page?.total / 10)}
            onChange={(e, page) => setPageNumber(page)}
            style={{
              margin: "20px 0",
            }}
            page={pageNumber}
          />
        </PageCentralContainer>
      )} */}
    </ListContainer>
  );
}

export const ListContainer = styled.div<{ isMobile: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  margin: 0 auto;

  ${(props) =>
    props.isMobile &&
    `
    padding-bottom: 55px;
  `}
`;

const KeyWordsBox = styled(motion.div)`
  position: relative;
  width: 100%;
  height: auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const KeyWord = styled(motion(Typography))<{
  hoverbg?: string;
  hovercolor?: string;
}>`
  position: relative;
  width: auto;
  height: 24px;
  padding: 5px 10px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;

  cursor: zoom-in;
  &:hover {
    background-color: ${(props) => props.hoverbg};
    color: ${(props) => props.hovercolor};
  }
`;

export const LoadingCentralContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const PageCentralContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MetadataSearchContainer = styled(Typography)`
  position: relative;
  width: 100%;
  height: auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const NoResultContainer = styled(Typography)`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
