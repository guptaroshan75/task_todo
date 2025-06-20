import { Box, Button, CircularProgress } from "@mui/material";
import { Grid, Typography, useTheme } from "@mui/material";
import { Form, Formik } from "formik";
import MyInput from "../../components/MyInput";
import { useNavigate, useParams } from "react-router-dom";
import { collection, addDoc, getDoc, } from "firebase/firestore";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "../../config/firebase.config";
import { ChevronLeft } from "lucide-react";
import { loadingButtonStyle } from "../../utils/helper";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { selectUser } from "../../features/auth/AuthSlice";

interface TaskToDoValues {
    title: string;
    description: string;
}

const TaskToDoForm = () => {
    const navigate = useNavigate();
    const { taskId } = useParams();
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useSelector(selectUser);
    const [initialValues, setInitialValues] = useState<TaskToDoValues>({
        title: "",
        description: "",
    });

    useEffect(() => {
        const fetchTaskData = async () => {
            if (!taskId) return;
            try {
                const docRef = doc(db, "tasks", taskId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setInitialValues({
                        title: data.title || "",
                        description: data.description || "",
                    });
                }
            } catch (err) {
                console.error("Error fetching task:", err);
                toast.error("Failed to fetch task data.");
            }
        };

        fetchTaskData();
    }, [taskId]);

    const handleSubmit = async (values: TaskToDoValues) => {
        setIsLoading(true);
        try {
            if (taskId) {
                const taskRef = doc(db, "tasks", taskId);
                await updateDoc(taskRef, {
                    title: values.title,
                    description: values.description,
                    userId: user.uniqueId,
                    createdAt: serverTimestamp(),
                });
            } else {
                const docRef = await addDoc(collection(db, "tasks"), {
                    title: values.title,
                    description: values.description,
                    userId: user.uniqueId,
                    createdAt: serverTimestamp(),
                });

                await updateDoc(docRef, { id: docRef.id });
            }

            toast.success(`Task ${taskId ? "updated" : "created"} successfully!`);
            navigate(-1);
        } catch (error: any) {
            toast.error("Something went wrong");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Grid size={12} mx={1.3} mb={2}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                {(props) => (
                    <Form style={{ width: "100%" }}>
                        <Box sx={{
                            mb: 2, display: "flex", alignItems: "center", width: "100%",
                            justifyContent: "space-between",
                        }}>
                            <Button onClick={() => navigate(-1)} disableRipple
                                startIcon={<ChevronLeft style={{ color: "#4A5A6B" }} />}
                                sx={{
                                    color: "#4A5A6B", fontSize: "16px", fontWeight: 600,
                                    "&:hover": { backgroundColor: "transparent" },
                                }}
                            >
                                Back
                            </Button>

                            <Button type="submit" disabled={isLoading} variant="contained"
                                onClick={() => props.handleSubmit()} sx={{
                                    ...loadingButtonStyle, cursor: "pointer", boxShadow: "none",
                                    "&.Mui-disabled": {
                                        backgroundColor: theme.palette.secondary.light,
                                        pointerEvents: "auto", color: "#4A5A6B",
                                        cursor: "not-allowed",
                                    },
                                }}
                            >
                                {isLoading && <CircularProgress size={20} sx={{ marginRight: 0.5 }} />}
                                {`${taskId ? "Update" : "Save"} Task`}
                            </Button>
                        </Box>

                        <Box width="100%" p={2} borderRadius={3} sx={{
                            backgroundColor: "#FBFCFF",
                            border: "1px solid #D5D5D5",
                        }}>
                            <Typography sx={{
                                fontWeight: 600, mb: 2,
                                color: "#2E2E2E", fontSize: "16px"
                            }}>
                                {`Task ${taskId ? "Update" : "Add"}`}
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid size={12}>
                                    <MyInput isRequired name="title" fullWidth
                                        formikProps={props} label="Title"
                                    />
                                </Grid>

                                <Grid size={12}>
                                    <MyInput isRequired name="description" fullWidth
                                        formikProps={props} label="Description"
                                        customType="textarea"
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Grid>
    );
};

export default TaskToDoForm;