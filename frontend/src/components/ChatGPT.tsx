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
import SendIcon from '@mui/icons-material/Send';
import { set } from "lodash";

interface ChatGPTPros {
  search: string;
  style: CSSProperties;
  info?: Message;
}

interface ChatGPTResult {
  role: string;
  content: string;
  followup: string[] | null;
}

export default function ChatGPT({ search, style, info }: ChatGPTPros) {
  const { theme } = useTheme();
  const [results, setResults] = useState<IResult[]>([]);
  const [chatGptResult, setChatGptResult] = useState<ChatGPTResult[]>([{ role: "user", content: search, followup: null }])

  const askQuestion = (question: string) => {
    router.push({
      pathname: "/results",
      query: { search: question },
    });
  };

  const sendQuestion = async (question: string) => {
    if (question === "") question = (document.getElementById("question") as HTMLInputElement).value;
    else question = question;
    setChatGptResult((old) => {
      return [
        ...old,
        {
          role: "user",
          content: question,
          followup: null,
        },
      ];
    });
    (document.getElementById("question") as HTMLInputElement).value = "";
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "user", content: `Tell me what you know about: ${search}` },
      ],
      model: "gpt-3.5-turbo",
    });

    const followupQuestion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Generate 2 or 3 follow up questions within very simple and short sentence about ${search}.`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    setChatGptResult((old) => {
      return [
        ...old,
        {
          role: "gpt",
          content: chatCompletion.choices[0].message.content,
          followup: followupQuestion.choices[0].message.content
            .split("\n")
            .map((question: string) =>
              question.replace(/^\d+\.\s*/, "").trim()
            ),
        },
      ];
    })
  }

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

        const followupQuestion = await openai.chat.completions.create({
          messages: [
            {
              role: "user",
              content: `Generate 2 or 3 follow up questions within very simple and short sentence about ${search}.`,
            },
          ],
          model: "gpt-3.5-turbo",
        });

        setChatGptResult((old) => {
          return [
            ...old,
            {
              role: "gpt",
              content: chatCompletion.choices[0].message.content,
              followup: followupQuestion.choices[0].message.content
                .split("\n")
                .map((question: string) =>
                  question.replace(/^\d+\.\s*/, "").trim()
                ),
            },
          ];
        })
      } catch (error) {
        setChatGptResult((old) => {
          return [
            ...old,
            {
              role: "gpt",
              content: "Unable to complete the search.",
              followup: null,
            },
          ];
        })
        error;
      }
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
        height: 'calc(100vh - 190px)',
        backgroundColor: theme?.colors.bg_secondary,
        paddingLeft: "20px",
        paddingRight: "20px",
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
      {chatGptResult.map((result, index) => (
        <>
          {result.role === "user" ?
            <TextBoxQuestion style={{ backgroundColor: theme?.colors.bg_qtextbox, color: theme?.colors.text_secondary }}>
              <Pre>{result.content}</Pre>
            </TextBoxQuestion>
            :
            <TextBoxAnswer
              style={{
                backgroundColor: theme?.colors.bg_atextbox,
              }}
            >
              <ChatGPTResult style={{ color: theme?.colors.text_secondary }}>
                <Pre>{result.content}</Pre>
                {result.followup && result.followup.length > 0 && (
                  <div style={{ marginTop: "10px", fontWeight: "bold" }}>
                    Follow-up questions:
                  </div>
                )}
                <FollowUpQuestions>
                  {result.followup &&
                    result.followup.map((question, index) => (
                      <Question
                        key={index}
                        onClick={() => sendQuestion(question)}
                        style={{
                          color: theme?.colors.text_secondary,
                          backgroundColor: theme?.colors.bg_qtextbox,
                        }}
                      >
                        {index + 1}. {question}
                      </Question>
                    ))}
                </FollowUpQuestions>
              </ChatGPTResult>
            </TextBoxAnswer>
          }
        </>
      ))}


      <InputTextBox>
        <textarea name="question" id="question" placeholder="Ask any question about a spec."></textarea>
        <SendIconBox>
          <SendIcon
            style={{ position: "relative", left: "10px", color: "#0000ff" }}
            onClick={() => sendQuestion("")}
          />
        </SendIconBox>
      </InputTextBox>

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

const TextBoxQuestion = styled.div`
  position: relative;  
  box-shadow: 0 2px 4px #00000024, 0 0 2px #0000001f;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: auto;
  border-radius: 5px;
  padding: 10px;
  width: fit-content;
`;

const SendIconBox = styled.div`
  height: 50px;
  display: flex;
  flex-direction: column-reverse;
`;

const InputTextBox = styled.div`
  display: flex;
  gap: 5px;
  padding: 10px 20px;
  box-shadow: 0 2px 4px #00000024, 0 0 2px #0000001f;
  border-radius: 5px;
  position: sticky;
  bottom: 10px;
  width: 100%;
  background-color: #fff;
  textarea {
    resize: none;
    border: none;
    outline: none;
    width: 100%;
    height: 50px;
    font-size: 18px;
    padding: 1px;
  }
`;

const ChatGPTBox = styled.div`
  position: relative;
  width: 100%;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ddd;
  }
`;

const TextBoxAnswer = styled.div`
  position: relative;
  box-shadow: 0 2px 4px #00000024, 0 0 2px #0000001f;
  margin: 10px 0;
  border-radius: 5px;
  padding: 10px;
  width: 80%;
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
  font-style: italic;
  cursor: pointer;
  width: fit-content;
  padding: 5px 10px;
  border-radius: 12px;
`;
