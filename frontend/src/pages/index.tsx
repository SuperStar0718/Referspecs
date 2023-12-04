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
          <svg
            font-size="3.75rem"
            aria-hidden="true"
            aria-label="Chat logo"
            fill="rgba(115, 118, 225, 1)"
            className="___12fm75w f1w7gpdv fez10in fg4l7m0"
            role="img"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.85 8.15a2.84 2.84 0 0 1 .69 1.11l.45 1.38a.54.54 0 0 0 1.02 0l.45-1.38a2.84 2.84 0 0 1 1.8-1.8l1.38-.44a.54.54 0 0 0 0-1.03h-.03l-1.38-.45a2.84 2.84 0 0 1-1.8-1.8L7 2.36a.54.54 0 0 0-1.03 0L5.5 3.74l-.01.03a2.84 2.84 0 0 1-1.76 1.77l-1.38.44a.54.54 0 0 0 0 1.03l1.38.45c.42.14.8.37 1.11.69ZM20 7a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-2.59l-5.8 5.8a1 1 0 0 1-1.4 0L10 14.4l-5.3 5.3a1 1 0 0 1-1.4-1.42l6-6a1 1 0 0 1 1.4 0l1.8 1.8L17.59 9H15a1 1 0 1 1 0-2h5Zm.02 10.96.76.25h.02a.3.3 0 0 1 .14.47.3.3 0 0 1-.14.1l-.77.26a1.58 1.58 0 0 0-1 1l-.24.76a.3.3 0 0 1-.58 0l-.24-.77a1.57 1.57 0 0 0-1-1l-.77-.25a.3.3 0 0 1-.14-.46.3.3 0 0 1 .14-.1l.77-.26a1.58 1.58 0 0 0 .98-1l.25-.76a.3.3 0 0 1 .57 0l.25.77a1.58 1.58 0 0 0 1 1Z"
              fill="rgba(115, 118, 225, 1)"
            ></path>
          </svg>
          <Title className="text-black text-6xl font-semibold mb-8">
            Chat with your data
          </Title>
          <Description>Ask anything or try an example</Description>
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
      >
        <Weather />
        <DocCount countDocs={countDocs} />
      </Footer>
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
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 3.125rem;
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
