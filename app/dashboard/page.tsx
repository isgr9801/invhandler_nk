"use client";
import { useState, useEffect } from "react";
import React from "react";
import { Line } from "react-chartjs-2";

import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Page = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	function setAuthAction(arg0: string) {
		throw new Error("Function not implemented.");
	}

	return (
		<div>
			<div className="">
				<a
					href="/dashboard"
					className="text-base font-semibold text-blue-600 underline dark:text-blue-500 hover:no-underline cursor-pointer"
				>
					dashboard
				</a>
			</div>
			<div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-4 sm:p-6">
				<div className="flex flex-col md:flex-row gap-6 mt-2">
					{/* upload and insert regular price sheet CSV */}
					<div className="w-full md:w-1/2 lg:max-w-lg p-4 bg-gray-100 dark:bg-gray-800 shadow rounded-lg">
						<h3 className="text-lg font-semibold">Search something here</h3>

						<div className="flex justify-center mt-6">
							<input
								type="text"
								className="mt-2 block w-full rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
								required
							/>
							<button
								onClick={() => {
									setAuthAction("upload-csv");
									setIsModalOpen(true);
								}}
								className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-8 rounded-full transition transform hover:scale-105"
							>
								search
							</button>
						</div>
					</div>
				</div>

				{/* Graph Container */}
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mt-6 w-full max-w mx-auto">
					<h3 className="text-lg font-semibold mb-2">Production Trend</h3>
					<div className="w-full overflow-x-auto"></div>
				</div>

				{/* Collapsible records table */}
				<div className="mt-6 w-full max-w mx-auto">
					<h3 className="text-lg font-semibold mb-2">Production History</h3>

					{/* Production Start Records */}
					<Accordion className="mt-4">
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<p className="text-lg">Production Start Records</p>
						</AccordionSummary>
						<AccordionDetails>
							<TableContainer component={Paper} className="overflow-x-auto">
								<Table>
									<TableHead>
										<TableRow>
											<TableCell>Timestamp</TableCell>
											<TableCell>User</TableCell>
											<TableCell align="right">Product Count</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										<TableRow>
											<TableCell>March 23, 2025, 10:30 AM</TableCell>
											<TableCell>test@example.com</TableCell>
											<TableCell align="right">50</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>March 22, 2025, 3:00 PM</TableCell>
											<TableCell>user@example.com</TableCell>
											<TableCell align="right">30</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
						</AccordionDetails>
					</Accordion>

					{/* Production Stop Records */}
					<Accordion className="mt-4">
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<p className="text-lg">Production Stop Records</p>
						</AccordionSummary>
						<AccordionDetails>
							<TableContainer component={Paper} className="overflow-x-auto">
								<Table>
									<TableHead>
										<TableRow>
											<TableCell>Timestamp</TableCell>
											<TableCell>User</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										<TableRow>
											<TableCell>March 23, 2025, 11:00 AM</TableCell>
											<TableCell>test@example.com</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>March 22, 2025, 5:00 PM</TableCell>
											<TableCell>user@example.com</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
						</AccordionDetails>
					</Accordion>
				</div>
			</div>
		</div>
	);
};

export default Page;
