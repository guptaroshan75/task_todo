import type { FC } from "react";
import { Avatar, Box, Typography } from "@mui/material";

interface LogoProps {
    horizontal?: boolean;
    hideLogo?: boolean;
    logo?: string;
    title?: string;
    sub_title?: string;
    fontSize?: string | number;
    size?: number;
    sub_fontSize?: string | number;
    admin_logo?: string;
}

const Logo: FC<LogoProps> = ({
    horizontal = true,
    hideLogo = false,
    logo,
    title,
    sub_title,
    fontSize,
    size = 60,
    sub_fontSize,
    admin_logo,
}) => {
    return (
        <Box sx={{
            display: "flex", padding: admin_logo ? "11px" : 1,
            flexDirection: horizontal ? "row" : "column", alignItems: "center",
        }}>
            {!hideLogo && (
                <img loading="eager" src={"/assets/img/logo.png"}
                    style={{ height: 60, width: "100%", objectFit: "contain" }}
                />
            )}

            <Box display={"flex"} alignItems={"center"} gap={1}>
                {logo && (
                    <Avatar alt={logo} src={logo} sx={{ height: size, width: size }} />
                )}

                {admin_logo && (
                    <Box component={"img"} src={admin_logo} sx={{ width: "100%" }} />
                )}

                <Box display={"flex"} flexDirection={"column"}>
                    {title && (
                        <Typography sx={{ fontSize: fontSize, fontWeight: 600, color: "#D4902B" }}>
                            {title}
                        </Typography>
                    )}

                    {sub_title && (
                        <Typography sx={{ fontSize: sub_fontSize, fontWeight: 400, color: "#000" }}>
                            {sub_title}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default Logo;
