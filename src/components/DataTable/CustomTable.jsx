import { Select, TableBody, TableCell, TableRow } from "@mui/material";
import { Typography, Tooltip, styled, useMediaQuery } from "@mui/material";
import { useTheme, Box, InputLabel, ListItemText, TableHead } from "@mui/material";
import { Menu, Pagination, MenuItem, Button, Checkbox } from "@mui/material";
import { CircularProgress, Divider, FormControl, Table, TableContainer } from "@mui/material";
import { flexRender, getCoreRowModel } from "@tanstack/react-table";
import { getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Fragment, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Frown, MoveDown, MoveUp, Settings, Trash } from "lucide-react";
import { useDispatch } from "react-redux";
import { CONSTANTS, PAGE_SIZE } from "../../utils/staticData";

const CustomTable = ({
    id,
    columns,
    rows,
    isLoading = false,
    hideFooter = true,
    hideFilters = true,
    loaderComponent,
    emptyDataComponent,
    tableNotes,
    element,
    filename,
    exportOnClick,
    exportXlsx = false,
    exportToWordDoc = false,
    showDelete = true,
    customHeaderComponent,
    multiRows = {},
    hideCol = [],
    defaultVisible = {},
    pagination,
    maxHeight = "58vh",
    minHeight = 200
}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { pathname, search } = useLocation();
    const [sorting, setSorting] = useState([]);
    const [rowSelection, setRowSelection] = useState({});
    const [selectedRows, setSelectedRows] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmData, setConfirmData] = useState(null);
    const isSmScreen = useMediaQuery("(max-width:600px)");
    const { show = true, page = 1, pageSize = 10, totalData = 0 } = pagination || {};

    const [columnVisibility, setColumnVisibility] = useState(() => {
        const savedColumnVisibility = localStorage.getItem(`cv-${id}`);
        return JSON.parse(savedColumnVisibility ?? JSON.stringify(defaultVisible));
    });

    useEffect(() => {
        localStorage.setItem(`cv-${id}`, JSON.stringify(columnVisibility));
    }, [columnVisibility]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const table = useReactTable({
        data: rows, columns,
        state: {
            columnVisibility, sorting, rowSelection,
        },
        enableRowSelection: true,
        onColumnVisibilityChange: setColumnVisibility,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    useEffect(() => {
        setSelectedRows({
            info: table?.getSelectedRowModel().flatRows || [],
            table: multiRows?.table,
            api: multiRows?.api,
            tags: multiRows?.tags,
        });
    }, [rowSelection]);

    const handleChangeRowsPerPage = (e) => {
        const newPageSize = parseInt(e.target.value, 10);
        const url = new URL(window.location.href);
        const searchParams = new URLSearchParams(url.search);

        searchParams.set("pageSize", newPageSize.toString());
        searchParams.set("page", "1");

        let newPath = url.pathname + "?" + searchParams.toString();
        navigate(newPath);
    };

    const handleChangePage = (e, newPage) => {
        const pageQueryParam = `page=${newPage}`;
        const pageParamExists = search.includes("page=");
        const newPath = pageParamExists
            ? pathname + search.replace(/page=\d+/, pageQueryParam)
            : pathname + search + (search ? "&" : "?") + pageQueryParam;
        navigate(newPath);
    };

    const startIndex = (+pagination.page - 1) * +pagination.pageSize;
    const endIndex = startIndex + +pagination.pageSize;

    const canShowToolTip = (data) => {
        return data.props.cell.getValue() ? data.props.cell.getValue().length > 30 : false;
    };

    return (
        <Fragment>
            <Box sx={{
                width: "100%", overflow: "hidden", position: "relative", minHeight: minHeight,
                bgcolor: theme.palette.mode === "dark" ? "#2b2b2b" : "#FFFFFF",
            }}>
                {isLoading && (
                    <Box sx={{
                        display: "flex", justifyContent: "center", alignItems: "center",
                        background: "#d0d0d09c", position: "absolute", inset: 0, zIndex: 9,
                    }}>
                        {loaderComponent ? loaderComponent : <CircularProgress />}
                    </Box>
                )}

                {hideFilters && (
                    <Box sx={{
                        display: "flex", alignItems: "center", justifyContent: "flex-end",
                        padding: '8px 14px', gap: 1, flexDirection: isSmScreen ? "column" : "row",
                    }}
                    >
                        <Box sx={{
                            display: "flex", alignItems: "center", justifyContent: "flex-end",
                            gap: 1, flexDirection: isSmScreen ? "column" : "row",
                        }}>
                            {customHeaderComponent && customHeaderComponent(selectedRows)}
                            {Object.keys(rowSelection).length > 0 && showDelete && (
                                <Button variant="contained" color={multiRows?.bg ? multiRows?.bg : "error"}
                                    startIcon={multiRows?.icon ? multiRows?.icon : <Trash />} onClick={() => {
                                        multiRows?.handlemultiple ? multiRows.handlemultiple(
                                            table.getSelectedRowModel().flatRows
                                        ) : setShowConfirm(true);
                                        setConfirmData({
                                            info: table.getSelectedRowModel().flatRows,
                                            table: multiRows?.table,
                                            api: multiRows?.api,
                                            tags: multiRows?.tags,
                                        });
                                    }}
                                >
                                    {multiRows?.text ? multiRows?.text : "Delete"}{" "}
                                    {multiRows.hideCountRow ? null : Object.keys(rowSelection).length + " Rows"}
                                </Button>
                            )}

                            {/* Column Visibility */}
                            <Button variant="outlined" aria-controls={open ? "column-visibility" : undefined}
                                aria-haspopup="true" aria-expanded={open ? "true" : undefined}
                                onClick={handleClick} sx={{ minWidth: "36px", padding: "6px 6px" }}
                            >
                                <Settings size={23} />
                            </Button>

                            <Menu id="column-visibility" anchorEl={anchorEl} open={open} onClose={handleClose}>
                                <Box>
                                    <MenuItem dense onClick={table.getToggleAllColumnsVisibilityHandler()} sx={{
                                        padding: '0px 12px', gap: 2
                                    }}>
                                        <Checkbox checked={table.getIsAllColumnsVisible()} sx={{ padding: 0 }} />
                                        <ListItemText primary={"Select All"} />
                                    </MenuItem>

                                    <Divider />

                                    {table.getAllLeafColumns().filter(
                                        (itm) => !hideCol.includes(itm.id) && itm.id !== "select"
                                    ).map((column) => (
                                        <MenuItem dense onClick={column.getToggleVisibilityHandler()}
                                            key={column.id} sx={{ padding: '0px 12px', gap: 2 }}
                                        >
                                            <Checkbox checked={column.getIsVisible()} sx={{ padding: 0 }} />
                                            <ListItemText primary={flexRender(column.columnDef.header)} sx={{
                                                textTransform: "capitalize",
                                            }} />
                                        </MenuItem>
                                    ))}
                                </Box>
                            </Menu>
                        </Box>
                    </Box>
                )}

                {tableNotes}

                <TableContainer sx={{ maxHeight: maxHeight, overflowX: "auto", }}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.filter((itm) => !hideCol.includes(itm.id)).map((header) => (
                                        <TableCell colSpan={header.colSpan} key={header.id} sx={{
                                            backgroundColor: '#F0F4F7', color: theme.palette.primary.contrastText,
                                            textAlign: "center", whiteSpace: "nowrap", textTransform: "capitalize",
                                        }}>
                                            <div {...{
                                                onClick: header.column.getToggleSortingHandler(),
                                                style: {
                                                    gap: "5px", justifyContent: "center",
                                                    cursor: header.column.getCanSort() ? "pointer" : "default",
                                                    whiteSpace: "nowrap", display: "flex", alignItems: "center",
                                                },
                                            }}>
                                                {header.isPlaceholder ? null : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}

                                                {{
                                                    asc: <MoveUp size={14} />,
                                                    desc: <MoveDown size={14} />,
                                                }[header.column.getIsSorted()] ?? null}
                                            </div>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>

                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
                                <TableRow hover key={row.id} sx={{
                                    backgroundColor: row.getIsSelected() ?
                                        theme.palette.mode === "dark"
                                            ? theme.palette.grey[900] : theme.palette.grey[300] :
                                        theme.palette.mode === "dark" ?
                                            theme.palette.grey[800] : theme.palette.grey[50],
                                }}
                                >
                                    {row.getVisibleCells().filter((itm) => !hideCol.includes(itm.column.id))
                                        .map((cell) => (
                                            <TableCell key={cell.id} sx={{
                                                textAlign: "center", border: `1px solid #d8d8d838`,
                                                whiteSpace: "nowrap", position: "relative",
                                                fontSize: CONSTANTS.fontSize, textTransform: "capitalize",
                                            }}>
                                                {cell.column.columnDef.tooltip ||
                                                    canShowToolTip(
                                                        flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )
                                                    ) ? (
                                                    <HtmlTooltip arrow title={flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}>
                                                        <Box sx={{
                                                            width: "250px", whiteSpace: "nowrap",
                                                            overflow: "hidden", textOverflow: "ellipsis",
                                                            fontSize: CONSTANTS.fontSize,
                                                            marginInline: "auto", maxHeight: "50px",
                                                        }}>
                                                            {flexRender(
                                                                cell.column.columnDef.cell,
                                                                cell.getContext()
                                                            )}{" "}
                                                        </Box>
                                                    </HtmlTooltip>

                                                ) : cell.column.columnDef.cell(cell.getContext()) ? (
                                                    flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )
                                                ) : (
                                                    "-"
                                                )}
                                            </TableCell>
                                        ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {!isLoading && rows && rows?.length === 0 && (
                    <Box sx={{
                        display: "flex", justifyContent: "center",
                        alignItems: "center", padding: '10px',
                    }}>
                        {emptyDataComponent ? (emptyDataComponent) : (
                            <Typography display={"grid"} gap={2} sx={{ placeItems: "center" }}>
                                <Frown size={50} opacity={theme.palette.mode === "light" ? 0.1 : 0.5}
                                    color={theme.palette.primary.main}
                                />
                                No Data Found!!
                            </Typography>
                        )}
                    </Box>
                )}

                {hideFooter && (
                    <Box sx={{
                        px: 1, display: "flex", justifyContent: "flex-end",
                        alignItems: "center", gap: 3,
                    }}>
                        <InputLabel>Rows Per Page</InputLabel>

                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <Select disabled={!show} value={pagination.pageSize} label=""
                                onChange={handleChangeRowsPerPage}
                            >
                                {PAGE_SIZE.map((itm, index) => (
                                    <MenuItem key={index} value={itm} sx={{ fontSize: CONSTANTS.fontSize }}>
                                        {itm}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <InputLabel>
                            {startIndex + 1}-
                            {Math.min(show ? endIndex : pagination.totalData, pagination.totalData)}
                            -of {pagination.totalData}
                        </InputLabel>

                        {show && (
                            <Pagination showFirstButton showLastButton variant="outlined" shape="rounded"
                                color="primary" count={Math.ceil(pagination?.totalData / +pagination.pageSize)}
                                page={+pagination.page} onChange={handleChangePage}
                            />
                        )}
                    </Box>
                )}
            </Box>
        </Fragment>
    );
};

export default CustomTable;

export const selectable = {
    id: "select",
    exportAble: false,
    header: ({ table }) => (
        <IndeterminateCheckbox sx={{ "& svg": { color: (theme) => theme.palette.primary.contrastText }, }} {...{
            checked: table.getIsAllPageRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllPageRowsSelectedHandler(),
        }} />
    ),
    cell: ({ row }) => (
        <IndeterminateCheckbox value={row.original.id} {...{
            checked: row.getIsSelected(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
        }} />
    ),
};

export const IndeterminateCheckbox = ({ ...rest }) => {
    const ref = useRef(null);
    return <Checkbox ref={ref} {...rest} size={"small"} />;
};