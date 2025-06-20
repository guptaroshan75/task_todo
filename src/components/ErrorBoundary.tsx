import React, { type ReactNode } from "react";
import ErrorIcon from "@mui/icons-material/Error";
import { Box, Button, Grid, Typography } from "@mui/material";
import { RotateCw } from "lucide-react";

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: any) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error: any) {
		console.log("error", error);
	}

	handleRefresh = () => {
		this.setState({ hasError: false });
		window.location.reload();
	};

	render() {
		if (this.state.hasError) {
			return (
				<Grid size={12}>
					<Box height={"calc(100vh - 150px)"} display={"flex"}
						alignItems={"center"} justifyContent={"center"}
					>
						<Box textAlign={"center"}>
							<ErrorIcon sx={{ fontSize: "5rem", color: "var(--main-color)" }} />
							<Typography mt={1} variant="h4" fontWeight={700} color="black">
								Something went wrong
							</Typography>

							<Typography mb={3} mt={1}>
								There'was a problem processing the request Please try again.
							</Typography>

							<Button variant="contained" onClick={this.handleReferesh}
								startIcon={<RotateCw size={15} />}
							>
								Referesh
							</Button>
						</Box>
					</Box>
				</Grid>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;