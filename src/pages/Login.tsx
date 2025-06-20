import { Paper, Typography, InputAdornment, Box } from "@mui/material";
import { IconButton, Button, CircularProgress, Grid } from "@mui/material";
import { Form, Formik } from "formik";
import { useCallback, useState, } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSchema } from "../utils/formSchema";
import MyInput from "../components/MyInput";
import Logo from "../components/Logo";
import { CONSTANTS } from "../utils/staticData";
import { loadingButtonStyle } from "../utils/helper";
import toast from "react-hot-toast";
import { signin } from "../features/auth/AuthSlice";
import { auth, db } from "../config/firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, Timestamp } from "firebase/firestore";

interface LoginValues {
    email: string;
    password: string;
}

interface ResetValue {
    resetForm: () => void
}

interface FirestoreUser {
    uniqueId: string;
    email: string;
    fullname: string;
    createdAt?: Timestamp;
}

const Login = () => {
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleClickShowPassword = useCallback(
        () => setShowPassword((show) => !show),
        [showPassword]
    );

    const handleLogin = async (values: LoginValues, { resetForm }: ResetValue) => {
        setIsLoading(true)
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth, values.email, values.password
            );
            const user = userCredential.user;

            const userDocRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userDocRef);

            if (!userSnap.exists()) {
                toast.error("User data not found in Firestore");
                return;
            }
            const rawData = userSnap.data() as FirestoreUser;

            const userData = {
                ...rawData,
                createdAt: rawData.createdAt?.toDate().toISOString() || null,
            };
            dispatch(signin(userData));
            localStorage.setItem(CONSTANTS.tokenLocalStorage, userData.uniqueId);
            // localStorage.setItem(CONSTANTS.tokenLocalStorage, (user as any).accessToken);
            toast.success("Login Successful");
            resetForm()
        } catch (error: any) {
            if (error.code === "auth/user-not-found") {
                toast.error("User not found");
            } else if (error.code === "auth/invalid-credential") {
                toast.error("Invalid Credentials");
            } else {
                toast.error(error.message || "Login failed");
            }
            resetForm()
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <Grid container sx={{
            height: "100vh", p: 2, backgroundSize: "cover", display: "flex",
            background: `url(/assets/images/login1.png) no-repeat center`,
            justifyContent: "center", alignItems: "center",
        }}>
            <Paper elevation={6} sx={{
                width: { xs: "90%", sm: "70%", md: "40%", lg: "35%" },
                maxWidth: "640px", padding: { xs: 3, sm: 4 },
                backgroundColor: "#FFEACC", borderRadius: 2,
            }}>
                <Logo horizontal={false} hideLogo={true} logo={"/assets/images/logo.png"}
                    title={"TASK TODO"} fontSize={CONSTANTS.fontSizeMid}
                />

                <Typography sx={{
                    fontWeight: 600, fontSize: "20px",
                    color: "#000000", textAlign: "center",
                }}>
                    Login to Account
                </Typography>

                <Typography sx={{
                    fontWeight: 500, fontSize: "16px",
                    color: "#696969", textAlign: "center",
                }}>
                    Please enter your email and password to continue
                </Typography>

                <Formik onSubmit={handleLogin} validationSchema={loginSchema}
                    initialValues={{
                        email: "rg1234@gmail.com",
                        password: "Roshan@123",
                    }}
                >
                    {(props) => (
                        <Form style={{ marginTop: 20 }} onSubmit={props.handleSubmit}>
                            <MyInput isRequired name={"email"}
                                label={"Email Address"}
                                formikProps={props}
                            />

                            <MyInput isRequired name={"password"}
                                label={"Password"} formikProps={props}
                                containerStyle={{ marginTop: 1, marginBottom: 1.5 }}
                                type={showPassword ? "text" : "password"}
                                rightElement={
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleClickShowPassword} edge="end">
                                            {!showPassword ? (
                                                <VisibilityOff sx={{ color: "#4A5A6B" }} />
                                            ) : (
                                                <Visibility sx={{ color: "#4A5A6B" }} />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />

                            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                <Typography fontWeight={500} sx={{
                                    textDecoration: "none", fontSize: CONSTANTS.fontSize,
                                    display: "flex", justifyContent: "flex-end",
                                }}>
                                    Don't have an account?
                                    <Typography fontWeight={500} to={"/sign-up"}
                                        component={Link} marginLeft={0.5} sx={{
                                            textDecoration: "none", color: "#FF7B54",
                                            fontSize: CONSTANTS.fontSize,
                                            display: "flex", justifyContent: "flex-end",
                                        }}
                                    >
                                        Sign Up
                                    </Typography>
                                </Typography>
                            </Box>

                            <Button fullWidth variant={"contained"} disabled={isLoading}
                                type="submit" sx={{
                                    ...loadingButtonStyle, color: "#fff",
                                    marginBlock: 0, marginTop: 1.3,
                                }}
                            >
                                {isLoading && <CircularProgress size={15} />} Sign in
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Grid>
    );
};

export default Login;