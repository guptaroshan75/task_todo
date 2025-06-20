import { Box, useMediaQuery } from "@mui/material";
import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import LoaderUi from "./LoaderUi";
import { useSelector } from "react-redux";
import { selectSidebar } from "../features/sidebar/SidebarSlice";
import ErrorBoundary from "./ErrorBoundary";
const Sidebar = lazy(() => import("./Sidebar"));
const Header = lazy(() => import("./Header"));

const Layout = () => {
    const isBreakpointMd = useMediaQuery((theme) => theme.breakpoints.down("md"));
    const { isOpened } = useSelector(selectSidebar);

    const handleToggleSidebar = () => {
        console.log("Hello");
    };

    return (
        <Suspense fallback={<LoaderUi />}>
            <Box sx={{ display: "flex", height: "100vh", backgroundColor: '#FFFBF2' }}>
                <Sidebar isBreakpointMd={isBreakpointMd} />
                <Header drawer={isOpened} setDrawer={handleToggleSidebar} />

                <Box component={"main"} sx={{
                    flex: 1, minHeight: "calc(100vh - 80px)", paddingTop: 10,
                    overflowX: "auto", paddingInline: 1, backgroundColor: '#FFFBF2'
                }}>
                    <ErrorBoundary>
                        <Outlet />
                    </ErrorBoundary>
                </Box>
            </Box>
        </Suspense>
    );
};

export default Layout;