import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid Email Format")
    .required("Email-Id is Required"),
  password: Yup.string()
    .min(6, "Password Must Be At Least 6 Characters")
    .required("Password is Required"),
});

export const signUpSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is Required"),
  email: Yup.string()
    .email("Invalid Email Format")
    .required("Email-Id is Required"),
  password: Yup.string()
    .min(6, "Password Must Be At Least 6 Characters")
    .required("Password is Required"),
});