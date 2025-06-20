import { useEffect, type FC } from "react";
import { Drawer, Box, CircularProgress, Tooltip, Zoom } from "@mui/material";
import { Typography, useTheme } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { useDispatch, useSelector } from "react-redux";
import { CONSTANTS, SA_MENU_LIST } from "../utils/staticData";
import { openMenus, selectSidebar, setMenus } from "../features/sidebar/SidebarSlice";
import { LogOut } from "lucide-react";
import { logout } from "../features/auth/AuthSlice";

interface SidebarProps {
    isBreakpointMd: boolean;
}

const Sidebar: FC<SidebarProps> = ({ isBreakpointMd }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { isOpened, menuDrawerWidth, menus } = useSelector(selectSidebar);

    useEffect(() => {
        dispatch(setMenus(SA_MENU_LIST));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem(CONSTANTS.tokenLocalStorage);
        dispatch(openMenus());
        dispatch(logout());
        navigate("/", { replace: true });
    };

    return (
        <Box sx={{ width: menuDrawerWidth, position: "relative" }}>
            <Drawer variant={isBreakpointMd ? "temporary" : "permanent"} open={isOpened}
                ModalProps={{ keepMounted: false }} sx={{
                    width: menuDrawerWidth, flexShrink: 0, "& .MuiDrawer-paper": {
                        width: menuDrawerWidth, zIndex: 9, boxSizing: "border-box",
                        overflow: 'hidden', borderRight: 'none',
                        backgroundColor: theme.palette.secondary.light,
                    },
                }}
            >
                <Box sx={{ backgroundColor: theme.palette.primary.light }}>
                    <Logo horizontal={false} hideLogo={true} logo={"/assets/images/logo.png"}
                        title={"TASK TODO"} fontSize={CONSTANTS.fontSizeCompany} size={48}
                    />

                </Box>

                <Box sx={{ backdropFilter: "blur(15px)", borderRight: 'none', height: "100%" }}>
                    {menus && menus.length > 0 ? (
                        <SimpleBar style={{ maxHeight: "88vh", width: "100%" }} autoHide={true}
                            className="custom-scrollbar"
                        >
                            <Box px={2} mt={2} mb={3} display="grid" gap={1}>
                                {menus?.map((menu: any, idx: any) => (
                                    <Tooltip title={menu?.title} placement="right" arrow TransitionComponent={Zoom}
                                        disableHoverListener={!open} key={idx}
                                    >
                                        <Link to={menu.path} style={{ textDecoration: 'none' }}>
                                            <Box padding={'0px 10px'} display={'flex'} sx={{
                                                color: pathname.startsWith(menu.path) ? theme.palette.secondary.main : "#2F384F",
                                                transitionDuration: "0.3s", cursor: "pointer", alignItems: 'center', height: '41px',
                                                "&:hover": { backgroundColor: theme.palette.primary.light, },
                                                borderRadius: '8px',
                                                marginTop: pathname.startsWith(menu.path) ? '2px' : '0px'
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.3 }}>
                                                    {menu?.icon && <Box component={"img"} sx={{ width: "22px", height: '22px' }}
                                                        src={pathname.startsWith(menu.path) ?
                                                            import.meta.env.VITE_IMAGE_URL + menu?.active_image :
                                                            import.meta.env.VITE_IMAGE_URL + menu?.icon
                                                        }
                                                    />}

                                                    <Typography sx={{ fontWeight: 500, fontSize: CONSTANTS.moduleFontSize }}>
                                                        {isOpened && menu?.name}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Link>
                                    </Tooltip>
                                ))}
                            </Box>
                        </SimpleBar>
                    ) : (
                        <Box display={'flex'} justifyContent={'center'}
                            alignItems={'center'} height={'85vh'}
                        >
                            <CircularProgress />
                        </Box>
                    )}
                </Box>

                <Box onClick={handleLogout} padding={'0px 10px'} mb={2} marginInline={2} display={'flex'} sx={{
                    color: '#2F384F', cursor: "pointer", alignItems: 'center', height: '41px',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.3 }}>
                        <LogOut style={{ color: '#4A5A6B', height: 25, width: 25 }} />
                        Logout
                    </Box>
                </Box>
            </Drawer>
        </Box>
    );
};

export default Sidebar;