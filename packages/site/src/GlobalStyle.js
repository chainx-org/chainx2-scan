import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
html {
  height: 100%;
}

body {
  height: 100%;
  margin: 0;
  font-family: -apple-system, 'Roboto', BlinkMacSystemFont, 'Segoe UI', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}
`;

export default GlobalStyle;
