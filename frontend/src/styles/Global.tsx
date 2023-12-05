import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        -webkit-tap-highlight-color: transparent;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  pre{
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  @font-face {
    font-family: 'Segoe UI';
    src: url('/fonts/SegoeUI.woff2') format('woff2'),
         url('/fonts/SegoeUI.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
`;

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[];
  }
}

export default GlobalStyle;
