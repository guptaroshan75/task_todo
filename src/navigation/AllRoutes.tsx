import { lazy, type JSX } from "react";
const Dashboard = lazy(() => import("../pages/Dashboard"));
const TaskList = lazy(() => import("../pages/Task/TaskList"));
const TaskToDoForm = lazy(() => import("../pages/Task/TaskToDoForm"));

export interface AppRoute {
    path: string;
    title?: string;
    element: JSX.Element;
}

export const allRoutes: AppRoute[] = [
    {
        path: "/dashboard",
        element: <Dashboard />,
        title: "Dashboard",
    },
    {
        path: "/task-todo",
        element: <TaskList />,
        title: "TaskList",
    },
    {
        path: "/task-todo/add",
        element: <TaskToDoForm />,
        title: "Task ToDo",
    },
    {
        path: "/task-todo/edit/:taskId",
        element: <TaskToDoForm />,
        title: "Task ToDo",
    },
];
