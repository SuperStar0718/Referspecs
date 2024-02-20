import { useTheme } from "@/context/Theme";
import openai from "@/service/openai";
import { useEffect, useRef, useState } from "react";
import styled, { CSSProperties } from "styled-components";
import Banner, { Message } from "./Banner";
import SendIcon from "@mui/icons-material/Send";
import Loading from "./Loading";
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
  const [isLoading, setIsLoading] = useState(false);
  const [chatGptResult, setChatGptResult] = useState<ChatGPTResult[]>([
    { role: "user", content: search, followup: null },
  ]);
  const messageShow = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messageShow.current) {
      try {
        setTimeout(() => {
          if (messageShow.current)
            messageShow.current.scrollTop = messageShow.current?.scrollHeight;
        }, 100);
      } catch (error) {
        console.warn(error);
      }
    }
  };

  const sendQuestion = async (question: string) => {
    if (question === "")
      question = (document.getElementById("question") as HTMLInputElement)
        .value;
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
    scrollToBottom();
    (document.getElementById("question") as HTMLInputElement).value = "";
    setIsLoading(true);
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
      setIsLoading(false);

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
      });
      scrollToBottom();
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
      });
      setIsLoading(false);
      scrollToBottom();
    }
  };

  useEffect(() => {
    const fetchCompletion = async () => {
      try {
        setIsLoading(true);
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
        setIsLoading(false);

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
        });
        scrollToBottom();
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
        });
        scrollToBottom();
        setIsLoading(false);
        error;
      }
    };

    if (search) {
      try {
        fetchCompletion();
      } catch (error) {
        error;
      }
    }
  }, [search]);

  return (
    <div style={{ width: "100%", ...style }}>
      <ChatGPTBox
        style={{
          height: "calc(100vh - 250px)",
          backgroundColor: theme?.colors.bg_secondary,
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
        ref={messageShow}
      >
        {info && <Banner message={info} />}
        {chatGptResult.map((result, index) => (
          <>
            {result.role === "user" ? (
              <TextBoxQuestion
                style={{
                  backgroundColor: theme?.colors.bg_qtextbox,
                  color: theme?.colors.text_secondary,
                }}
              >
                <Pre>{result.content}</Pre>
              </TextBoxQuestion>
            ) : (
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
                      result.followup.map(
                        (question, index) =>
                          // if question is empty, then continue
                          question && (
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
                          )
                      )}
                  </FollowUpQuestions>
                </ChatGPTResult>
              </TextBoxAnswer>
            )}
          </>
        ))}

        {isLoading && <Loading />}
      </ChatGPTBox>
      <InputTextBox
        style={{
          background: `linear-gradient(180deg, ${theme?.colors.bg_secondary}, transparent)`,
        }}
      >
        <textarea
          name="question"
          id="question"
          placeholder="Ask any question about a spec."
          style={{
            backgroundColor: theme?.colors.bg_atextbox,
            color: theme?.colors.text_secondary,
          }}
        ></textarea>
        <SendIconBox>
          <SendIcon
            style={{ position: "relative", left: "10px", color: "#0000ff" }}
            onClick={() => sendQuestion("")}
          />
        </SendIconBox>
      </InputTextBox>
    </div>
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
  width: 100%;
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
  box-shadow: 0 2px 4px #00000024, 0 0 2px #0000001f;
  overflow-y: scroll;
  scroll: smooth;
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
  text-decoration: underline;
  cursor: pointer;
  width: fit-content;
  padding: 5px 10px;
  border-radius: 12px;
`;
