import { Paper, Typography, InputAdornment, CircularProgress } from "@mui/material";
import { Box, Button, Grid, IconButton } from "@mui/material";
import { Form, Formik } from "formik";
import { useCallback, useState, } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { signUpSchema } from "../utils/formSchema";
import MyInput from "../components/MyInput";
import Logo from "../components/Logo";
import { CONSTANTS } from "../utils/staticData";
import { loadingButtonStyle } from "../utils/helper";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase.config";
import toast from "react-hot-toast";

interface SignUpValues {
    fullName: string;
    email: string;
    password: string;
}

interface ResetValue {
    resetForm: () => void
}

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleClickShowPassword = useCallback(() =>
        setShowPassword((show) => !show), [showPassword]
    );

    const handleSignUp = async (values: SignUpValues, { resetForm }: ResetValue) => {
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth, values.email, values.password
            );
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                uniqueId: user.uid,
                email: user.email,
                fullname: values.fullName,
                createdAt: serverTimestamp(),
            });

            toast.success("User Created Successfully");
            resetForm();
        } catch (error: any) {
            if (error.code === "auth/email-already-in-use") {
                toast.error("Email Already Exists");
            } else {
                toast.error(error.message || "Signup failed");
            }
            resetForm();
        } finally {
            setIsLoading(false);
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
                    Create An Account
                </Typography>

                <Typography sx={{
                    fontWeight: 500, fontSize: "16px",
                    color: "#696969", textAlign: "center",
                }}>
                    Please enter your email and password to continue
                </Typography>

                <Formik onSubmit={handleSignUp} validationSchema={signUpSchema}
                    initialValues={{
                        email: "",
                        fullName: "",
                        password: "",
                    }}
                >
                    {(props) => (
                        <Form style={{ marginTop: 20 }} onSubmit={props.handleSubmit}>
                            <MyInput isRequired name={"fullName"}
                                label={"Full Name"}
                                formikProps={props}
                            />

                            <MyInput isRequired name={"email"}
                                label={"Email Address"} formikProps={props}
                                containerStyle={{ marginTop: 1, marginBottom: 1.5 }}
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
                                    Have an account?
                                    <Typography fontWeight={500} to={"/"}
                                        component={Link} marginLeft={0.5} sx={{
                                            textDecoration: "none", color: "#FF7B54",
                                            fontSize: CONSTANTS.fontSize,
                                            display: "flex", justifyContent: "flex-end",
                                        }}
                                    >
                                        Log In
                                    </Typography>
                                </Typography>
                            </Box>

                            <Button fullWidth variant={"contained"} disabled={isLoading}
                                type="submit" sx={{
                                    ...loadingButtonStyle, color: "#fff",
                                    marginBlock: 0, marginTop: 1.3,
                                }}
                            >
                                {isLoading && <CircularProgress size={15} />} Sign Up
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Grid>
    );
};

export default SignUp;