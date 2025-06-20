import { Fragment, type FC } from "react";
import { Eye, Pencil, Trash, type LucideIcon } from "lucide-react";
import { Box, Divider, Tooltip, Zoom } from "@mui/material";

interface Action {
    icon?: LucideIcon;
    align?: "bottom" | "top" | "left" | "right";
    tooltipTitle?: string;
    action?: () => void;
    disabled?: boolean;
    className?: string;
    show?: boolean;
}

interface ActionButtonsProps {
    gap?: number;
    custom?: React.ReactNode;
    actions?: Partial<Record<"view" | "edit" | "delete", Partial<Action>>>;
}

interface ActionButtonProps {
    tooltipTitle: string;
    onClick?: () => void;
    icon: LucideIcon;
    align?: "bottom" | "top" | "left" | "right";
    className?: string;
}

const ActionButton: FC<ActionButtonProps> = ({
    tooltipTitle, onClick, icon: Icon, align, className
}) => {
    if (!Icon) return null;

    return (
        <Tooltip title={tooltipTitle} placement={align} arrow
            TransitionComponent={Zoom}
        >
            <Icon onClick={onClick} className={`social-btn ${className}`} />
        </Tooltip>
    );
};

const ActionButtons: FC<ActionButtonsProps> = ({ gap = 1, custom, actions = {} }) => {
    const defaultActions: Record<string, Action> = {
        view: {
            icon: Eye,
            align: "top",
            disabled: false,
            className: "success-combo",
        },

        edit: {
            icon: Pencil,
            align: "top",
            disabled: false,
            className: "danger-combo",
        },

        delete: {
            icon: Trash,
            align: "top",
            disabled: false,
            className: "red-combo",
        },
    };

    const combinedActions: Record<string, Action> = Object.keys(defaultActions).reduce((acc: any, key) => {
        acc[key] = {
            ...defaultActions[key as keyof typeof defaultActions],
            ...actions[key as keyof typeof actions]
        };
        return acc;
    }, {});

    const visibleActions = Object.keys(combinedActions).filter(
        (key) => combinedActions[key].show
    );

    return (
        <Box sx={{ display: "flex", gap: gap, justifyContent: "center" }}>
            {visibleActions.map((key, index) => {
                const { tooltipTitle, action, icon, align, disabled, className } = combinedActions[key];
                const Icon = icon;
                if (!Icon) return null;

                return (
                    <Fragment key={key}>
                        {index > 0 && (
                            <Divider orientation="vertical" variant="middle" flexItem />
                        )}

                        <ActionButton onClick={!disabled ? action : undefined} icon={Icon} align={align}
                            tooltipTitle={tooltipTitle || (key.charAt(0).toUpperCase() + key.slice(1))}
                            className={`${disabled ? "danger-combo-disable" : className}`}
                        />
                    </Fragment>
                );
            })}
            {custom}
        </Box>
    );
};

export default ActionButtons;