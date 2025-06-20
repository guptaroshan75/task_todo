import { IconButton, Button, Avatar, Box } from "@mui/material";
import { Typography, Toolbar, AppBar } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import { MenuIcon, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../features/auth/AuthSlice";
import { selectSidebar } from "../features/sidebar/SidebarSlice";
import { toggleMenus } from "../features/sidebar/SidebarSlice";
import type { FC } from "react";

interface HeaderProps {
    drawer: boolean;
    setDrawer: () => void;
}

const Header: FC<HeaderProps> = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const isSmScreen = useMediaQuery("(max-width:600px)");
    const { user } = useSelector(selectUser);
    const { isOpened, menuDrawerWidth } = useSelector(selectSidebar);

    const toggleDrawer = () => {
        dispatch(toggleMenus());
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        else if (hour < 18) return "Good Afternoon";
        else return "Good Evening";
    };

    return (
        <AppBar position="fixed" sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1, paddingRight: { xs: 1, md: 2 },
            backgroundColor: theme.palette.primary.light, backdropFilter: "blur(3px)",
            paddingLeft: 1, width: isSmScreen ? "100%" : `calc(100% - ${menuDrawerWidth}px)`,
            boxShadow: `0px 2px 4px -1px rgb(0 0 0 / 5%),
                0px 4px 5px 0px rgb(0 0 0 / 0%),  0px 1px 10px 0px rgb(0 0 0 / 4%)`,
        }}>
            <Toolbar disableGutters>
                <Box display={'flex'} alignItems={'center'}>
                    <IconButton disableRipple edge="start" color="inherit" aria-label="menu"
                        onClick={toggleDrawer}
                        sx={{
                            margin: 0.2, color: theme.palette.mode === "dark" ? "#ccc" : "gray",
                        }}
                    >
                        {!isOpened ?
                            <MenuIcon style={{ color: '#4A5A6B', height: 30, width: 30 }} /> :
                            <X style={{ color: '#4A5A6B', height: 30, width: 30 }} />
                        }
                    </IconButton>

                    <Typography sx={{
                        fontWeight: 500, color: '#4A5A6B',
                        fontSize: { xs: '15px', sm: '15px', md: '18px' },
                    }}>
                        {getGreeting()}
                    </Typography>
                </Box>

                <Box sx={{ marginInlineStart: "auto", display: "flex", alignItems: "center" }}>
                    <Button disableRipple size="small">
                        <Avatar alt={user?.fullname ?? "John Smith"} sx={{ marginInline: 1, }} src={user?.image &&
                            `${import.meta.env.VITE_IMAGE_URL}${user?.image}`}
                        />

                        <Box sx={{ textAlign: "left" }}>
                            <Typography sx={{
                                fontWeight: 400, color: '#4A5A6B', textTransform: 'capitalize',
                                fontSize: { xs: '15px', sm: '15px', md: '18px' },
                            }}>
                                {user?.fullname ?? "John Smith"}
                            </Typography>

                            <Typography sx={{
                                fontWeight: 400, fontSize: '12px', color: '#4A5A6B',
                                textTransform: 'lowercase'
                            }}>
                                {user?.email}
                            </Typography>
                        </Box>
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;