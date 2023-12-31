import { IconButton, List, ListItem, ListItemText } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import randomWords from "random-words";
import styled from "styled-components";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@/context/Theme";
import { useSearch } from "@/context/Search";
import { useMemo } from "react";

interface LuckyProps {
  show: number;
  desactive?: () => void;
}

export default function LuckyBox({ show, desactive }: LuckyProps) {
  const { theme } = useTheme();
  const { onSearch } = useSearch();
  const categoryWords = [
    "Aerospace & Defense",
    "Food & Pharmaceutical",
    "Medical Device",
    "Automotive",
    "Environment, Health, and Safety",
    "Accounting and Taxes",
    "Life Science",
    "Building and Construction",
  ];
  const draw = {
    hidden: (i: number) => ({
      x: -200,
      opacity: 0,
      transition: {
        x: {
          delay: i * 0.05,
          type: "spring",
        },
        opacity: { delay: i * 0.05, duration: 0.2 },
      },
    }),
    visible: (i: number) => {
      return {
        x: 0,
        opacity: 1,
        transition: {
          x: {
            delay: i * 0.2,
            type: "spring",
            duration: 0.3,
            bounce: 0.5,
            stiffness: 100,
          },
          opacity: { delay: i * 0.2, duration: 0.01 },
        },
      };
    },
  };
  return useMemo(
    () => (
      <AnimatePresence>
        {show && (
          <LuckyBoxRoot>
            {!!desactive && (
              <IconButton onClick={desactive}>
                <CloseIcon
                  sx={{
                    color: "#0000ff",
                  }}
                />
              </IconButton>
            )}
            <ListAnimated
              sx={{
                padding: "10px",
              }}
            >
              {categoryWords.map((word, index) => (
                <ListItemAnimated
                  key={word + index}
                  sx={{
                    backgroundColor: "#0000ff",
                    color: "#fff",
                    borderRadius: "3px",
                    marginBottom: "5px",
                    width: "fit-content",
                  }}
                  custom={index}
                  variants={draw}
                  initial="hidden"
                  animate="visible"
                  exit={"hidden"}
                  secondaryAction={
                    <IconButton onClick={() => onSearch({ query: word })}>
                      <OpenInNewIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={word} sx={{ marginRight: "10px" }} />
                </ListItemAnimated>
              ))}
            </ListAnimated>
          </LuckyBoxRoot>
        )}
      </AnimatePresence>
    ),
    [show]
  );
}

const ListItemAnimated = styled(motion(ListItem))``;
const ListAnimated = styled(motion(List))``;
const LuckyBoxRoot = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 100;
`;
