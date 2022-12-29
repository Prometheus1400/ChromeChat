import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import { MemoryRouter } from "react-router-dom"
import { createTheme, ThemeProvider } from "@mui/material/styles"
// import { CssBaseline } from "@mui/material"

const theme = createTheme({
    palette: {
        mode: "dark",
    },
})

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
    <MemoryRouter>
        <ThemeProvider theme={theme}>
            {/* <CssBaseline /> */}
            <App />
        </ThemeProvider>
    </MemoryRouter>
)
