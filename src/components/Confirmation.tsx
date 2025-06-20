import { Fragment, type ReactNode } from "react";
import { IconButton, Typography, useTheme } from "@mui/material";
import { DialogContent, DialogContentText } from "@mui/material";
import { Button, CircularProgress, Dialog, DialogActions } from "@mui/material";
import QuestionMarkRoundedIcon from "@mui/icons-material/QuestionMarkRounded";
import { loadingButtonStyle } from "../utils/helper";

interface ConfirmationProps {
    open: boolean;
    handleClose: () => void;
    handleConfirm: (data?: any) => void;
    disabled?: boolean;
    title?: string;
    desc?: string;
    isLoading?: boolean;
    buttonTitle?: string;
    children?: ReactNode;
    width?: number | string;
    data?: any;
    actionButtons?: ReactNode;
}

const Confirmation = ({
    open, handleClose, handleConfirm, disabled = false, title = "Confirmation",
    desc = "Are you sure you want to delete this user?", isLoading = false,
    buttonTitle = "Delete", children, width, data, actionButtons = null,
}: ConfirmationProps) => {
    const theme = useTheme();

    return (
        <Dialog onClose={handleClose} open={open} sx={{
            textAlign: "center", minWidth: 400,
            "& .MuiDialogContent-root": { width: width, maxWidth: "100%", },
        }}>
            <DialogContent>
                <IconButton size="small" sx={{
                    backgroundColor: theme.palette.primary.main, width: 50, height: 50,
                    "&:hover": { backgroundColor: theme.palette.primary.dark },
                }}>
                    <QuestionMarkRoundedIcon fontSize={"large"}
                        sx={{ color: theme.palette.error.contrastText }}
                    />
                </IconButton>

                <Typography mt={1} color={"black"} fontWeight={600}>
                    {title}
                </Typography>

                <DialogContentText>{desc}</DialogContentText>
                {children}
            </DialogContent>

            <DialogActions sx={{ justifyContent: "center", px: 2 }}>
                {actionButtons ? (
                    actionButtons
                ) : (
                    <Fragment>
                        <Button fullWidth variant="outlined" onClick={handleClose}>Cancel</Button>

                        <Button variant="contained" onClick={() => handleConfirm(data)}
                            disabled={disabled} autoFocus fullWidth sx={{ ...loadingButtonStyle }}
                            startIcon={isLoading && <CircularProgress color="inherit" size={15} />}
                        >
                            {buttonTitle}
                        </Button>
                    </Fragment>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default Confirmation;