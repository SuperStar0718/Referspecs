import {
  Avatar,
  Badge,
  Chip,
  Rating,
  Typography,
  keyframes,
} from "@mui/material";
import { color, motion } from "framer-motion";
import Link from "next/link";
import styled from "styled-components";
import ResultOptions from "./ResultOptions";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import { useMemo, useState } from "react";
import { Result, SearchData } from "@/libs/interfaces";
import { useTheme } from "@/context/Theme";
import useDeviceDetect from "@/hook/useDetectDevice";
import { random } from "lodash";

interface ResultProps {
  result: Result;
}

export default function Result({ result }: ResultProps) {
  const { theme } = useTheme();
  const [mouseOver, setMouseOver] = useState(false);
  const { isMobileView } = useDeviceDetect();

  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <ResultRoot
        onMouseEnter={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
      >
        <ResultBox
          bgSecondary={theme?.colors.bg_secondary}
          style={{
            left: isMobileView ? "0px" : "-20px",
          }}
          animate={{
            backgroundColor: mouseOver
              ? theme?.colors.bg_secondary
              : theme?.colors.bg,
            outline: mouseOver
              ? "1px solid " + theme?.colors.section.primary
              : "1px solid rgba(0, 0, 0, 0)",
            outlineOffset: mouseOver ? "5px" : "0px",
            transition: {
              outlineOffset: {
                duration: 0.2,
                delay: 0.2,
              },
            },
          }}
        >
          <Link href={result.url} target="_blank">
            <ResultTitle
              variant="h6"
              sx={{
                color: theme?.colors.text,
                "&:hover": {
                  color: theme?.colors.section.secondary,
                },
              }}
            >
              {result.title}
            </ResultTitle>
          </Link>

          <ResultContent
            variant="body2"
            sx={{
              color: theme?.colors.text_secondary,
            }}
            dangerouslySetInnerHTML={{
              __html: result.description,
            }}
            themeContext={theme}
          ></ResultContent>
        </ResultBox>
        {!isMobileView && (
          <ResultOptionsBox>
            <ResultOptions show={mouseOver} result={result}></ResultOptions>
          </ResultOptionsBox>
        )}
      </ResultRoot>
    </>
  );
}

const ResultRoot = styled(motion.div)`
  position: relative;
  width: 100%;
  height: auto;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;

const ResultTitle = styled(Typography)``;

const ResultContent = styled(Typography)<{
  themeContext?: any;
}>`
  & > strong {
    text-decoration: underline dotted;
    color: ${(props) => props.themeContext?.colors.secondary};
  }
`;

const ResultOptionsBox = styled(motion.div)`
  position: relative;
  width: 50px;
  height: 50px;
  background-color: transparent;
`;

const ResultBox = styled(motion.div)<{
  bgSecondary?: string;
}>`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;

  border: 1px solid rgba(0, 0, 0, 0);
`;

const Metadata = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 20px;
  margin: 10px 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`;
