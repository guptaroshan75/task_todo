import { Route, Routes } from "react-router-dom";
import { PublicRoutes, RequireAuth } from "../components/AuthChecker";
import { Suspense, lazy, type FC } from "react";
import LoaderUi from "../components/LoaderUi";
import { allRoutes } from "./AllRoutes";
const Login = lazy(() => import("../pages/Login"));
const SignUp = lazy(() => import("../pages/SignUp"));

const AppRouter: FC = () => {
    return (
        <Suspense fallback={<LoaderUi />}>
            <Routes>
                <Route element={<PublicRoutes />}>
                    <Route path="/" element={<Login />} />
                    <Route path="/sign-up" element={<SignUp />} />
                </Route>

                {allRoutes.map((route, index) =>
                    <Route key={index} element={<RequireAuth componentTitle={route.title} />}>
                        <Route path={route.path} element={route?.element} />
                    </Route>
                )}
            </Routes>
        </Suspense>
    );
};

export default AppRouter;