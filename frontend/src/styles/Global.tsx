import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        -webkit-tap-highlight-color: transparent;
    }
    html{
      font-family:Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif
    }
`;

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[];
  }
}

export default GlobalStyle;
