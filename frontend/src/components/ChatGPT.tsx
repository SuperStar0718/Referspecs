import { useTheme } from "@/context/Theme";
import openai from "@/service/openai";
import { Avatar, Chip, List, Tooltip, Typography } from "@mui/material";
import { color } from "framer-motion";
import { useEffect, useState } from "react";
import styled, { CSSProperties } from "styled-components";
import ModelTrainingIcon from "@mui/icons-material/ModelTraining";
import Result from "./Result";
import { Result as IResult } from "@/libs/interfaces";
import Banner, { Message } from "./Banner";
import router from "next/router";

interface ChatGPTPros {
  search: string;
  style: CSSProperties;
  info?: Message;
}

export default function ChatGPT({ search, style, info }: ChatGPTPros) {
  const { theme } = useTheme();
  const [completion, setCompletion] = useState("");
  const [followup, setFollowup] = useState(Array<string>());
  const [results, setResults] = useState<IResult[]>([]);

  const askQuestion = (question: string) => {
    router.push({
      pathname: "/results",
      query: { search: question },
    });
  };

  const adapterChatGptResultToResult = (
    resultsChatGpt: Array<{
      title: string;
      abs: string;
      keywords: string[];
      url: string;
    }>
  ): IResult[] => {
    return resultsChatGpt.map((result) => {
      return {
        title: result.title,
        abs: result.abs,
        keywords: result.keywords.map((keyword) => ({ text: keyword })),
        url: result.url,
        highlight_abs: result.abs,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
      };
    });
  };

  useEffect(() => {
    const fetchCompletion = async () => {
      try {
        const chatCompletion = await openai.chat.completions.create({
          messages: [
            { role: "user", content: `Tell me what you know about: ${search}` },
          ],
          model: "gpt-3.5-turbo",
        });

        completion;
        generateFollowUpQuestions();
        setCompletion(chatCompletion.choices[0].message.content);
      } catch (error) {
        setCompletion("Não foi possível completar a pesquisa.");
        error;
      }
    };

    const generateFollowUpQuestions = async () => {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Generate 2 or 3 follow up questions within very simple and short sentence about ${search}.`,
          },
        ],
        model: "gpt-3.5-turbo",
      });
      console.log("follow up questions:", chatCompletion.choices[0].message);
      //append this follow up questions to completion state variable using setcompletion
      setFollowup(
        chatCompletion.choices[0].message.content
          .split("\n")
          .map((question: string) => question.replace(/^\d+\.\s*/, "").trim())
      );
    };

    const fetchResults = async () => {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Bring two useful links about ${search} in an array in json format, each array object must contain the following properties: title, abs (abstract), keywords (string array) and url. Use a maximum of 300 tokens.`,
          },
        ],
        model: "gpt-3.5-turbo",
      });
      // JSON.parse(chatCompletion.choices[0].message.content);
      try {
        console.log("result:", chatCompletion.choices[0].message.content);
        setResults(
          adapterChatGptResultToResult(
            chatCompletion.choices[0].message.content
          )
        );
      } catch (error) {
        error;
      }
    };

    if (search) {
      try {
        fetchCompletion();
        fetchResults();
      } catch (error) {
        error;
      }
    }
  }, [search]);

  return (
    <ChatGPTBox
      style={{
        ...style,
      }}
    >
      {info && <Banner message={info} />}
      <MetaInfoChatGPT>
        {/* <Tooltip title="Modelo">
          <Chip
            avatar={
              <Avatar sx={{ backgroundColor: theme.colors.section.secondary }}>
                <ModelTrainingIcon
                  sx={{ width: 18, color: theme.colors.section.primary }}
                />
              </Avatar>
            }
            label="Modelo text-davinci-003"
            sx={{
              backgroundColor: theme.colors.bg_secondary,
              color: theme.colors.section.primary,
            }}
          />
        </Tooltip>
        <Tooltip title="Modelo">
          <Chip
            avatar={
              <Avatar sx={{ backgroundColor: theme.colors.section.secondary }}>
                <ModelTrainingIcon
                  sx={{ width: 18, color: theme.colors.section.primary }}
                />
              </Avatar>
            }
            label="No máximo 200 palavras"
            sx={{
              backgroundColor: theme.colors.bg_secondary,
              color: theme.colors.section.primary,
            }}
          />
        </Tooltip> */}
      </MetaInfoChatGPT>
      <TextBox
        style={{
          // border: `1px solid ${theme.colors.section.secondary}`,
          backgroundColor: theme.colors.bg_secondary,
        }}
      >
        <ChatGPTResult>
          <Pre>{completion}</Pre>
          {followup && followup.length > 0 && (
            <div style={{ marginTop: "10px", fontSize: "medium" }}>
              Follow up Questions:
            </div>
          )}
          <FollowUpQuestions>
            {followup &&
              followup.map((question, index) => (
                <Question key={index} onClick={() => askQuestion(question)}>
                  {index + 1}. {question}
                </Question>
              ))}
          </FollowUpQuestions>
        </ChatGPTResult>
      </TextBox>

      <List
        style={{
          padding: "10px 0",
        }}
      >
        {results.map((result) => (
          <Result key={result.url} result={result} />
        ))}
        {/* {results.length === 0 && (
          <NoResultContainer variant="body1" color={theme?.colors.text}>
            Nenhum resultado encontrado {":("}
          </NoResultContainer>
        )} */}
      </List>
    </ChatGPTBox>
  );
}

const ChatGPTBox = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
`;

const TextBox = styled.div`
  position: relative;
  margin: 10px 0;
  border-radius: 5px;
  padding: 10px;
`;

const MetaInfoChatGPT = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const NoResultContainer = styled(Typography)`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ChatGPTResult = styled.div`
  width: 100%;
  font-size: large;
  line-height: 1.75;
`;

const Pre = styled.pre`
  text-wrap: wrap;
`;

const FollowUpQuestions = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 10px;
  font-size: medium;
`;

const Question = styled.div`
  font-weight: 600;
  line-height: 24px;
  background-color: #e8ebfa;
  font-style: italic;
  cursor: pointer;
  width: fit-content;
  padding: 5px 10px;
  border-radius: 12px;
`;
