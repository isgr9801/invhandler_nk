import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import mysql from "mysql2/promise";

// MySQL Database Connection
const db = mysql.createPool({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DB,
});

export async function POST(req: NextRequest) {
	try {
		console.log("📩 Received upload request...");

		// Read formData from CSV upload
		const formData = await req.formData();
		const file = formData.get("file") as File | null;

		if (!file) {
			console.error("No file was uploaded.");
			return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
		}

		console.log("📂 File received:", file.name, "Size:", file.size);

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Save CSV to a temporary location
		const tempFilePath = path.join("/tmp", file.name);
		await fs.writeFile(tempFilePath, buffer);
		console.log("✅ File saved at:", tempFilePath);

		// Read CSV file
		let data;
		try {
			data = await fs.readFile(tempFilePath, "utf-8");
			console.log("📜 File read successfully.");
		} catch (readError) {
			console.error("Error reading file:", readError);
			return NextResponse.json(
				{ error: "Error reading CSV file" },
				{ status: 500 }
			);
		}

		// Parse CSV data
		const rows = data
			.trim()
			.split("\n")
			.map((row) => row.split(",").map((cell) => cell.trim()));

		// Validate CSV content
		if (rows.length < 2) {
			console.error("CSV file is empty or invalid:", rows);
			return NextResponse.json(
				{ error: "CSV file is empty or improperly formatted" },
				{ status: 400 }
			);
		}

		// Identify percentage columns
		const percentageColumns = [5];

		// Clean Data: Remove `%`, quotes, and trim spaces in percentage columns
		const cleanedRows = rows.map((row, rowIndex) => {
			if (rowIndex === 0) return row; // Keep headers

			percentageColumns.forEach((colIndex) => {
				if (row[colIndex]) {
					row[colIndex] = row[colIndex].replace(/["%]/g, "").trim(); // Remove % and quotes
				}
			});

			return row.map((cell) => (typeof cell === "string" ? cell.trim() : cell)); // Trim all values
		});

		//csv filter empty, space, or null
		const filteredRows = cleanedRows.filter((row, rowIndex) => {
			if (rowIndex === 0) return true; // Keep headers
			return row[0] && row[0].trim() !== "";
		});

		// console.log("Filtered Rows Before Insert:", filteredRows);

		// QUERY
		const insertQuery = `INSERT INTO price_mapProvided (ItemCode, ItemName, MRP, Qty_CB, Weight_CB, GST_Rate, GT_BasicCost, ClosingBox, ClosingQty, InBox, InQty, OutBox, OutQty, DE_BasicCost) VALUES ?`;
		const values = filteredRows
			.slice(1)
			.map((row) => [
				row[0],
				row[1],
				row[2],
				row[3],
				row[4],
				row[5],
				row[6],
				row[7],
				row[8],
				row[9],
				row[10],
				row[11],
				row[12],
				row[13],
			]);

		if (values.length === 0) {
			console.error("No valid rows to insert.");
			return NextResponse.json(
				{ error: "No valid data found in CSV after filtering" },
				{ status: 400 }
			);
		}

		// console.log("Final Data for MySQL:", values);
		console.log("Inserting data into MySQL...");

		await db.query(insertQuery, [values]);

		console.log("Data inserted into MySQL successfully.");

		return NextResponse.json({
			success: true,
			message: "CSV processed successfully!",
			data: filteredRows,
		});
	} catch (error) {
		console.error("Unexpected Error:", error);
		return NextResponse.json(
			{ error: `Unexpected error: ${(error as Error).message}` },
			{ status: 500 }
		);
	}
}
