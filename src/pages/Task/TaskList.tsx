import { useEffect, useMemo, useState } from "react";
import { collection, deleteDoc, doc, getDocs, Timestamp } from "firebase/firestore";
import { loadingButtonStyle, serialNumber } from "../../utils/helper";
import CustomTable, { selectable } from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import ActionButtons from "../../components/ActionButtons";
import Confirmation from "../../components/Confirmation";
import { db } from "../../config/firebase.config";
import toast from "react-hot-toast";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { CONSTANTS } from "../../utils/staticData";

interface Task {
    id: string;
    title: string;
    description: string;
    userId: string;
    createdAt: any;
}

const TaskList = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const columnHelper = createColumnHelper<Task>();
    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 100;

    const [rows, setRows] = useState<Task[]>([]);
    const [totalData, setTotalData] = useState(0);

    const [deleteModalShowing, setDeleteModalShowing] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchTasks = async () => {
        const auth = getAuth();

        onAuthStateChanged(auth, async (user: any) => {
            try {
                const querySnapshot = await getDocs(collection(db, "tasks"));
                const fetchedTasks: Task[] = querySnapshot.docs
                    .map((doc) => ({
                        id: doc.id,
                        ...(doc.data() as Omit<Task, "id">),
                    }))
                    .filter((task) => task.userId === user.uid);

                setRows(fetchedTasks);
                setTotalData(fetchedTasks.length);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        });
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleShowConfirmation = (id: string) => {
        setDeleteId(id);
        setDeleteModalShowing(true);
    };

    const handleConfirm = async () => {
        if (!deleteId) return;
        try {
            const taskRef = doc(db, "tasks", deleteId);
            await deleteDoc(taskRef);
            toast.success("Task deleted successfully");
            setDeleteModalShowing(false);
            setDeleteId(null);
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
            toast.error("Failed to delete task");
        }
    };

    const columns = useMemo(() => [
        selectable,
        columnHelper.accessor("sr_no", {
            header: "Sr No.",
            cell: (info) => {
                const serialNumbers = serialNumber(page, pageSize);
                return serialNumbers[info.row.index];
            },
        }),
        columnHelper.accessor("title", {
            header: "Title",
        }),
        columnHelper.accessor("description", {
            header: "Description",
        }),
        columnHelper.accessor("createdAt", {
            header: "Created At",
            cell: (info) => {
                const createdAt = info.getValue() as Timestamp | undefined;
                return createdAt?.toDate().toLocaleString("en-IN", {
                    day: "2-digit", month: "2-digit", year: "numeric",
                }) || "-";
            },
        }),
        columnHelper.accessor("action", {
            header: "Action",
            cell: (info) => (
                <ActionButtons actions={{
                    edit: {
                        show: true,
                        action: () => navigate(`/task-todo/edit/${info.row.original.id}`),
                    },
                    delete: {
                        show: true,
                        action: () => handleShowConfirmation(info.row.original.id),
                    },
                }} />
            ),
        }),
    ], [page, pageSize]);

    return (
        <Grid size={12} mx={1.3} mb={2}>
            <Box sx={{
                mb: 2, display: 'flex', alignItems: 'center', width: '100%',
                justifyContent: 'space-between',
            }}>
                <Typography sx={{
                    fontSize: CONSTANTS.fontSizeReg, color: '#4A5A6B', fontWeight: 600
                }}>
                    All Task
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button type="button" onClick={() => navigate(`/task-todo/add`)}
                        variant="contained" sx={{
                            ...loadingButtonStyle, cursor: 'pointer', boxShadow: 'none', "&:hover": {
                                boxShadow: "none", backgroundColor: theme.palette.button.main,
                            },
                        }}
                    >
                        Add Task
                    </Button>
                </Box>
            </Box>

            <CustomTable
                id={"task_list"}
                rows={rows || []}
                columns={columns}
                pagination={{ page, pageSize, totalData }}
                customHeaderComponent={(selectedRows: any) => (
                    <TableHeader selectedRows={selectedRows} showDownload={true} />
                )}
                showDelete={false}
            />

            <Confirmation open={deleteModalShowing}
                handleClose={() => setDeleteModalShowing(false)}
                title={"Confirmation"}
                desc={"Are you sure you want to delete this?"}
                handleConfirm={handleConfirm}
            />
        </Grid>
    );
};

export default TaskList;