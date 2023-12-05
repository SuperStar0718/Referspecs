import DocCount from "@/components/DocCount";
import LuckyBox from "@/components/ImLucky";
import SearchBox from "@/components/SearchBox";
import TopBar from "@/components/TopBar";
import Weather from "@/components/Weather/Weather";
// import AdUnit from "@/components/AdUnit";
import { useSearch } from "@/context/Search";
import { useTheme } from "@/context/Theme";
import useDeviceDetect from "@/hook/useDetectDevice";
import { countAllDocs } from "@/libs/result";
import { Button } from "@mui/material";
import { color, motion } from "framer-motion";
import { GetStaticProps } from "next";
import router from "next/router";
import { FormEvent, useMemo, useState } from "react";
import styled from "styled-components";

interface SearchPageProps {
  countDocs: number;
}

export default function SearchPage({ countDocs }: SearchPageProps) {
  const { theme } = useTheme();
  const { isMobileView } = useDeviceDetect();
  const [showLucky, setShowLucky] = useState(0);
  const {
    history,
    onSearch,
    searchState: [search, setSearch],
  } = useSearch();

  const askQuestion = (event: any) => {
    const text = event.target.textContent;
    router.push({
      pathname: "/results",
      query: { search: text },
    });
  };

  return (
    <SearchPageRoot
      animate={{
        backgroundColor: theme?.colors.bg,
      }}
    >
      <TopBar />
      <SearchBody>
        <ChatGPT>
          <img src="referspecs_logo.png" alt="" width="80px" height="80px" />
          <Text style={{ color: theme?.colors.text_secondary }}>
            ReferSpecs: Your AI-powerd CoPilot for Standards and Specifications
          </Text>
          <div style={{ display: "flex" }}>
            <div>
              <H1>Search</H1>
              <Text style={{ color: theme?.colors.text_secondary }}>
                Access and download over 60,000 standards and Specifications
              </Text>
            </div>
            <div>
              <H1>Conversational AI</H1>
              <Text style={{ color: theme?.colors.text_secondary }}>
                Ask question like: "What are the basic requirements of
                MIL-STD-461?"
              </Text>
            </div>
          </div>
          <QuestionPanel>
            <Question
              onClick={askQuestion}
              className="p-5 bg-[#dbdbdb] cursor-pointer rounded-xl hover:shadow-md hover:outline-2 hover:outline hover:outline-[#7376e1]"
            >
              What are the basic requirements of MIL-STD-461?
            </Question>
            <Question
              onClick={askQuestion}
              className="p-5 bg-[#dbdbdb] cursor-pointer rounded-xl hover:shadow-md hover:outline-2 hover:outline hover:outline-[#7376e1]"
            >
              What is the process for conducting a risk assessment in the SQF
              Food Safety Code?
            </Question>
            <Question
              onClick={askQuestion}
              className="p-5 bg-[#dbdbdb] cursor-pointer rounded-xl hover:shadow-md hover:outline-2 hover:outline hover:outline-[#7376e1]"
            >
              What are the principal SQF requirements for food safety?
            </Question>
          </QuestionPanel>
        </ChatGPT>
        <LuckyBox show={showLucky} desactive={() => setShowLucky(0)} />
        <SearchBox />
        <ButtonBox>
          <Button
            variant="outlined"
            sx={{
              background: "#fff",
              "border-color": "#0000ff",
              color: "#0000ff",
            }}
            onClick={() => setShowLucky(Math.round(Math.random() * 100))}
          >
            LIBRARY
          </Button>
          <Button
            variant="contained"
            sx={{ background: "#0000ff" }}
            onClick={() => onSearch()}
          >
            Search
          </Button>
        </ButtonBox>
      </SearchBody>
      {/* <AdUnit /> */}
      <Footer
        style={{
          padding: isMobileView ? "0 1.25rem" : "1.25rem 3.125rem",
        }}
      ></Footer>
    </SearchPageRoot>
  );
}
export const getStaticProps: GetStaticProps = async (ctx) => {
  const countDocs = await countAllDocs();
  return {
    props: {
      countDocs,
    },
    revalidate: 3600, // 1 hour
  };
};

const SearchPageRoot = styled(motion.div)<{ bg?: string }>`
  position: relative;
  display: block;

  min-height: 100vh;
`;

const SearchBody = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  padding: 1rem;
  width: 100%;
  gap: 1.25rem;
  height: calc(100vh - 6.25rem);
`;

const ButtonBox = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 1.25rem;
  width: 100%;
  z-index: 1;
`;

const Footer = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatGPT = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 1.25rem;
`;
const Title = styled.div`
  color: black;
  font-size: 3.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;
const Description = styled.div`
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 2rem;
`;
const QuestionPanel = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 64rem; /* equivalent to 4xl in Tailwind */

  @media (min-width: 640px) {
    /* this is for 'sm:' in Tailwind */
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem; /* equivalent to gap-3 in Tailwind */
  }
`;
const Text = styled.div`
  color: black;
  font-size: large;
  padding: 0px 30px 30px 30px;
`;
const H1 = styled.div`
  color: #1a731f;
  font-size: 2rem;
  text-align: center;
  font-weight: bold;
`;
const Question = styled.div`
  padding: 1.25rem; /* p-5 */
  background-color: #dbdbdb; /* bg-[#dbdbdb] */
  cursor: pointer; /* cursor-pointer */
  border-radius: 0.75rem; /* rounded-xl */
  font-size: 1.25rem; /* text-lg */
  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.05); /* shadow-md */
    outline: 2px solid #7376e1; /* outline-2 and outline-[#7376e1] */
  }
`;
