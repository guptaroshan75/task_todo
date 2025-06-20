import { CssBaseline, ThemeProvider } from "@mui/material";
import { Fragment } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import Store, { persistor } from "./features/store";
import AppRouter from "./navigation/AppRouter";
import { theme } from "./style/Theme";
import { PersistGate } from "redux-persist/integration/react";

const App = () => {
    return (
        <Fragment>
            <Provider store={Store}>
                <PersistGate loading={null} persistor={persistor}>
                    <ThemeProvider theme={theme('light')}>
                        <CssBaseline />
                        <BrowserRouter>
                            <AppRouter />
                        </BrowserRouter>
                    </ThemeProvider>
                </PersistGate>
            </Provider>

            <Toaster position="top-right" toastOptions={{
                success: { style: { background: "green", color: "white" } },
                error: { style: { background: "red", color: "white" } },
            }} />
        </Fragment>
    );
};

export default App;