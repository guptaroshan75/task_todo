import { Box, Grid, Typography } from "@mui/material";
import { CONSTANTS } from "../utils/staticData";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase.config";
import { useEffect, useState } from "react";

const Dashboard = () => {
    const [totalTasks, setTotalTasks] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const tasksSnapshot = await getDocs(collection(db, "tasks"));
                setTotalTasks(tasksSnapshot.size);

                const usersSnapshot = await getDocs(collection(db, "users"));
                setTotalUsers(usersSnapshot.size);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            }
        };

        fetchDashboardStats();
    }, []);

    const DASHBOARD_CARD = [
        {
            title: "Total Task",
            count: totalTasks,
            image: "/assets/images/active_visitors.png",
        },
        {
            title: "Total User",
            count: totalUsers,
            image: "/assets/images/total_donations.png",
        },
    ];

    return (
        <Grid container spacing={2} mx={1.3} mb={2}>
            <Box sx={{
                display: 'flex', alignItems: 'center', width: '100%',
                justifyContent: 'space-between',
            }}>
                <Typography sx={{
                    fontSize: CONSTANTS.fontSizeReg, color: '#4A5A6B', fontWeight: 600
                }}>
                    Dashboard
                </Typography>
            </Box>

            <Grid size={12}>
                <Grid container spacing={2}>
                    {DASHBOARD_CARD?.map((data, index) => (
                        <Grid size={{ md: 6, sm: 12, xs: 12 }} key={index}>
                            <Box display="flex" justifyContent={'space-between'} sx={{
                                height: '140px', width: "100%", backgroundColor: '#FFF', p: 2,
                                boxShadow: ' 0px 2px 8px 0px #0000000A', flexDirection: 'column'
                            }}>
                                <Box display="flex" alignItems={'center'} gap={2}>
                                    <Box component={"img"} src={data?.image}
                                        sx={{ width: "60px", height: '60px' }}
                                    />

                                    <Typography sx={{
                                        fontWeight: 400, fontSize: CONSTANTS.moduleFontSize,
                                        color: '#4A5A6B',
                                    }}>
                                        {data?.title}
                                    </Typography>
                                </Box>

                                <Box display="flex" alignItems={'center'} justifyContent={'space-between'}>
                                    <Typography sx={{ fontWeight: 600, fontSize: '25px', color: '#1C1C1C', lineHeight: 0 }}>
                                        {data?.count}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;