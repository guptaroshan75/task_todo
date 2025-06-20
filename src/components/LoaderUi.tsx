import { Box, CircularProgress } from "@mui/material";

const LoaderUi = ({ minHeight = "100vh" }) => {
    return (
        <Box sx={{
            display: "flex", justifyContent: "center",
            alignItems: "center", minHeight: minHeight,
        }}>
            <CircularProgress />
        </Box>
    );
};

export default LoaderUi;