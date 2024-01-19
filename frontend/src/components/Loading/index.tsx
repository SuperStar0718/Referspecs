import { color } from "framer-motion";
import React from "react";
import styled from "styled-components";
import { useTheme } from "@/context/Theme";

const Loading = () => {
  const { theme } = useTheme();
  return (
    <LoadingRoot
      className="snippet"
      data-title="dot-flashing"
      style={{ backgroundColor: theme?.colors.bg_atextbox }}
    >
      <div className="stage" style={{ marginLeft: "20px" }}>
        <div className="dot-flashing"></div>
      </div>
    </LoadingRoot>
  );
};

const LoadingRoot = styled.div`
  position: relative;
  box-shadow: 0 2px 4px #00000024, 0 0 2px #0000001f;
  margin: 10px 0;
  border-radius: 5px;
  padding: 10px;
  width: 75px;
  background-color: white;
`;

export default Loading;
