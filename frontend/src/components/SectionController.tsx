import styled from "styled-components";
import PageButtonList from "./PaginationList";
import Result from "./Result";
import TransitionSectionComponent from "./TransitionSectionComponent";
import { searchOnSearchOnMath, searchWithPage } from "@/libs/result";
import { RefObject, createRef, useEffect, useRef, useState } from "react";
import ChatGPT from "./ChatGPT";
import { FilterFields } from "@/libs/interfaces";

interface SectionControllerProps {
  section: number;
  search: string;
  filterFields: FilterFields;
}

export default function SectionController({
  section,
  search,
  filterFields,
}: SectionControllerProps) {
  const sectionsTranslate = ["docfynd", "searchonmath", "chatgpt"];

  const [height, setHeight] = useState(0);

  const chatGptMessage = {
    ptBr: "",
    enUs: "Unfortunately, the limit of free use of the OpenAI API for the GPT model is small, in order not to reach this limit quickly, this functionality is temporarily suspended and will be reactivated during the presentation of the work.",
  };

  const searchOnMathMessage = {
    ptBr: "",
    enUs: "Integration with SearchOnMath is in progress. We hope to be able to count on your results here soon. The results displayed below are fictitious, for the purpose of UI/UX evaluation.",
  };

  useEffect(() => {
    setHeight(
      document?.getElementById(sectionsTranslate[section])?.offsetHeight || 100
    );
  }, [section]);

  return (
    <SectionControllerRoot
      style={{
        left: -section * 100 + "%",
        transitionDelay: ".4s",
      }}
    >
      <TransitionSectionComponent listener={section} />
      <ChatGPT
        search={search}
        style={{
          position: "relative",
          zIndex: section === 0 ? 0 : -100,
          opacity: section === 0 ? 1 : 0,
          transitionDelay: ".4s",

          top: 0,
          left: 0,
        }}
      />
      {/* <PageButtonList
        id="docfynd"
        getMorePages={searchWithPage}
        search={search}
        isLoadingInitialData={false}
        cardComponent={Result}
        filterValues={filterFields}
        style={{
          position: "relative",
          zIndex: section === 0 ? 0 : -100,
          opacity: section === 0 ? 1 : 0,
          transitionDelay: ".4s",

          top: 0,
          left: 0,
        }}
      /> */}

      <PageButtonList
        id="searchonmath"
        getMorePages={searchOnSearchOnMath}
        search={search}
        info={searchOnMathMessage}
        isLoadingInitialData={false}
        cardComponent={Result}
        style={{
          position: "relative",
          left: 0,
          zIndex: section === 1 ? 0 : -100,
          opacity: section === 1 ? 1 : 0,
          transitionDelay: ".4s",
        }}
      />
      <ChatGPT
        search={search}
        style={{
          position: "relative",
          zIndex: section === 0 ? 0 : -100,
          opacity: section === 0 ? 1 : 0,
          transitionDelay: ".4s",

          top: 0,
          left: 0,
        }}
      />
    </SectionControllerRoot>
  );
}

const SectionControllerRoot = styled("div")`
  position: relative;
  width: 300%;
  display: flex;
`;
