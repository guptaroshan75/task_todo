// import { configureStore, isRejected } from "@reduxjs/toolkit";
// import authReducer, { logout } from "./auth/AuthSlice";
// import sidebarReducer from "./sidebar/SidebarSlice";
// import toast from "react-hot-toast";

// const tokenErrorToast = (storeAPI: any) => (next: any) => (action: any) => {
//     if (isRejected(action)) {
//         if (action.payload?.status === 403) {
//             toast.error(
//                 action.payload?.data?.message ||
//                 "Your session has expired, please login again...",
//                 { id: "tokenError" }
//             );
//             storeAPI.dispatch(logout());
//         }
//     }

//     return next(action);
// };

// const Store = configureStore({
//     reducer: {
//         auth: authReducer,
//         sidebar: sidebarReducer,
//     },
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//             serializableCheck: {
//                 ignoredActions: [''],
//             },
//         }).concat(tokenErrorToast),
// });

// export default Store;


// import { combineReducers, configureStore, isRejected } from "@reduxjs/toolkit";
// import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
// import storage from "redux-persist/lib/storage";
// import toast from "react-hot-toast";
// import authReducer, { logout } from "./auth/AuthSlice";
// import sidebarReducer from "./sidebar/SidebarSlice";

// const persistConfig = {
//   key: "task_todo",
//   version: 1,
//   storage,
//   whitelist: ["auth", "sidebar"],
// };

// const rootReducer = combineReducers({
//   auth: authReducer,
//   sidebar: sidebarReducer,
// });

// let hasHydrated = false;

// const tokenErrorToast = (api: any) => (next: any) => (action: any) => {
//   if (action.type === REHYDRATE) {
//     hasHydrated = true;
//   }

//   if (hasHydrated && isRejected(action)) {
//     if (action.payload?.status === 403) {
//       toast.error(
//         action.payload?.data?.message ||
//           "Your session has expired, please login again...",
//         { id: "tokenError" }
//       );
//       api.dispatch(logout());
//     }
//   }

//   return next(action);
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// const Store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }).concat(tokenErrorToast),
// });

// export const persistor = persistStore(Store);
// export default Store;

// export type RootState = ReturnType<typeof Store.getState>;
// export type AppDispatch = typeof Store.dispatch;


import { combineReducers, configureStore, isRejected } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH } from "redux-persist";
import { REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { encryptTransform } from "redux-persist-transform-encrypt";
import authReducer, { logout } from "./auth/AuthSlice";
import sidebarReducer from "./sidebar/SidebarSlice";
import settingReducer from "./settings/SettingSlice";
import toast from "react-hot-toast";

const tokenErrorToast = () => (next: any) => (action: any) => {
    if (isRejected(action)) {
        if (action.payload?.status === 403) {
            toast.error(
                action.payload?.data?.message ||
                "Your session has expired, please login again...",
                { id: "tokenError", }
            );
            Store.dispatch(logout());
        }
    }

    return next(action);
};

const persistConfig = {
    key: "task_todo_admin",
    version: 1,
    storage,
    whitelist: ["auth", "sidebar", "settings"],
    transforms: [
        encryptTransform({
            secretKey: "import.meta.env.PERSIST_SEC",
            onError: (error: any) => {
                console.log("error", error);
            },
        }),
    ],
};

const rootReducer = combineReducers({
    auth: authReducer,
    sidebar: sidebarReducer,
    settings: settingReducer,
});

// const persistedReducer = persistReducer(persistConfig, rootReducer);
const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(persistConfig, rootReducer);

const Store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat([
            tokenErrorToast,
        ]),
});

export let persistor = persistStore(Store);
export default Store;