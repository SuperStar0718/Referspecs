import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        -webkit-tap-highlight-color: transparent;
    }
`;

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[];
  }
}

export default GlobalStyle;
