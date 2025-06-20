export const loadingButtonStyle = {
  textTransform: "capitalize",
  minWidth: "100px",
  display: "flex",
  alignItems: "center",
  gap: 1,
  backgroundColor: "#FE0000",
  color: "#fff",
  fontSize: "14px",
  fontWeight: 400,
};

export const serialNumber = (pageNo: number, pageSize: number) => {
  const start = (+pageNo - 1) * +pageSize + 1;
  return Array.from({ length: +pageSize }, (_, index) => start + index);
};