import { Autocomplete, Box, Popper, styled, TextField, useMediaQuery } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

const StyledPopper = styled(Popper)(({ theme }) => ({
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    borderRadius: 4,
    zIndex: 1300,
}));

const TableHeader = ({
    showFilter,
    extraComponent = null,
    value,
    paceholder,
    handleChange,
    options,
    minWidth,
}) => {
    const isSmScreen = useMediaQuery('(max-width:600px)');

    return (
        <Box sx={{
            display: "flex", alignItems: "center", gap: 1,
            flexDirection: isSmScreen ? "column" : "row",
        }}>
            {showFilter && (
                <Box sx={{ minWidth: minWidth || 200 }}>
                    <Autocomplete size="small" fullWidth options={options || []}
                        getOptionLabel={(option) => option?.label || ''}
                        value={options?.find((opt) => opt?.value === value) || null}
                        onChange={(event, newValue) => {
                            handleChange({ target: { value: newValue?.value || '' } });
                        }}
                        isOptionEqualToValue={(option, val) => option?.value === val?.value}
                        clearIcon={<ClearIcon />} clearOnEscape PopperComponent={StyledPopper}
                        renderInput={(params) => (
                            <TextField  {...params} placeholder={paceholder || "All"} variant="outlined"
                                InputProps={{
                                    ...params.InputProps, sx: { height: 36 },
                                }}
                            />
                        )}
                    />
                </Box>
            )}

            {extraComponent}
        </Box>
    );
};

export default TableHeader;
