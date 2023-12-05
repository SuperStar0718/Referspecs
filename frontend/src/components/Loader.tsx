import React from "react";
import styled, { CSSProperties } from "styled-components";

const Loader = () => {
  return (
    <LoadingBox>
      <Bar></Bar>
      <Bar></Bar>
      <Bar></Bar>
    </LoadingBox>
  );
};

export default Loader;

const LoadingBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
`;

const Bar = styled.div`
  width: 100%;
  height: 20px;
  background: linear-gradient(270deg, #007cf0, #00dfd8);
  background-size: 400% 400%;
  animation: gradientShift 2s ease infinite;
  border-radius: 5px;
`;
