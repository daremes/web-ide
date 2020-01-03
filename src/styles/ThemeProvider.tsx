import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import WebIdeCssBaseline from "./WebIdeCssBaseline";
import {
    createMuiTheme,
    ThemeProvider as MuiThemeProvider
} from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { ThemeProvider } from "emotion-theming";
import { assocPath, pathOr, pipe } from "ramda";
import { ITheme } from "./types";
import { CodeMirrorPainter } from "./CodeMirrorPainter";
import themeMonokai from "./_theme_monokai";
import { makeMuiTheme } from "./utils";

const ThirdPartyLibPainter = ({ theme }) => (
    <style>{`
    .splitter-layout > .layout-splitter {
         background-color: ${theme.highlight.primary};
    }

    .splitter-layout .layout-splitter:hover {
        background-color: ${theme.highlightAlt.primary};
    }
        `}</style>
);

const CsoundWebIdeThemeProvider = props => {
    const monospaceFont = `"Fira Mono", monospace`;
    // const regularFont = `"Roboto", sans-serif`;
    const regularFont = `"Times New Roman"`;

    const theme: ITheme = pipe(
        assocPath(["font", "monospace"], monospaceFont),
        assocPath(["font", "regular"], regularFont)
    )(useSelector(
        pathOr(themeMonokai, ["ThemeReducer", "selectedTheme"])
    ) as ITheme) as ITheme;

    const muiTheme = createMuiTheme();
    const muiThemeMixed = makeMuiTheme(muiTheme, theme);

    return (
        <MuiThemeProvider theme={muiThemeMixed}>
            <ThemeProvider theme={theme ? theme : {}}>
                <CssBaseline />
                <WebIdeCssBaseline />
                <CodeMirrorPainter theme={theme} />
                <ThirdPartyLibPainter theme={theme} />
                {props.children}
            </ThemeProvider>
        </MuiThemeProvider>
    );
};

export default CsoundWebIdeThemeProvider;