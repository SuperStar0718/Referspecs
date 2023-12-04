import { Typography, TypographyProps } from "@mui/material";
import { useRouter } from "next/router";
import styled from "styled-components";

export default function GeneralTitle(props: TypographyProps) {
  const router = useRouter();
  return (
    <Title
      onClick={() => router.push("/")}
      color={
        "-webkit-linear-gradient(261.97deg, #0000ff 53.17%, #DA3D3D 72.83%)"
      }
      {...props}
    >
      <img src="referspecs_logo.png" alt="logo" width="50px" height="50px" />
    </Title>
  );
}

const Title = styled(Typography)`
  background: -webkit-linear-gradient(260deg, #da3d3d 53.17%, #0000ff 72.83%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
`;
