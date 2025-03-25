import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import mysql from "mysql2/promise";

//mysqldbconn
const db = mysql.createPool({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DB,
});

export async function POST(req: NextRequest) {
	try {
		console.log("Received upload request...");

		// Read formData from CSV upload
		const formData = await req.formData();
		const file = formData.get("file") as File | null;

		if (!file) {
			console.error("No file was uploaded.");
			return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
		}

		console.log("File received:", file.name, "Size:", file.size);

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		//Save csv @/tmp to a temporary location
		const tempFilePath = path.join("/tmp", file.name);
		await fs.writeFile(tempFilePath, buffer);
		console.log("✅ File saved at:", tempFilePath);

		//Read CSV file
		let data;
		try {
			data = await fs.readFile(tempFilePath, "utf-8");
			console.log("File read successfully.");
		} catch (readError) {
			console.error("Error reading file:", readError);
			return NextResponse.json(
				{ error: "Error reading CSV file" },
				{ status: 500 }
			);
		}

		//Parsed CSV data
		const rows = data
			.trim()
			.split("\n")
			.map((row) => row.split(",").map((cell) => cell.trim()));

		// console.log("Parsed CSV Data:", rows);

		//validate CSV content
		if (rows.length < 2) {
			console.error("CSV file is empty or invalid:", rows);
			return NextResponse.json(
				{ error: "CSV file is empty or improperly formatted" },
				{ status: 400 }
			);
		}

		// mark only cols with % symbols
		const percentageColumns = [8, 9, 13, 14, 15, 17, 18, 19];

		//Clean Data: Remove `%`, quotes and trim spaces in percentage columns
		const cleanedRows = rows.map((row, rowIndex) => {
			if (rowIndex === 0) return row; // Skip headers

			percentageColumns.forEach((colIndex) => {
				if (row[colIndex]) {
					row[colIndex] = row[colIndex].replace(/["%]/g, "").trim(); // Removeval of % and quotes, trim spaces
				}
			});

			return row.map((cell) => (typeof cell === "string" ? cell.trim() : cell)); // Trim all values
		});

		console.log("🔹 Final Cleaned Data Before Insert:", cleanedRows);

		// mysql query
		const insertQuery = `INSERT INTO imp_masterprice (ItemStatus, ItemCode , ItemName , MRP , Category , PcsPerBox , KgPerBox , GramsPerPcs , Tax , Margin , PTDPerCase , BasicRate , PTD_Landing , PTD , Scheme , TotalMargin_PTD , PTR_Landing , PTR , SchemePostPTR , Total_Margin_PTR) VALUES ?`;

		const values = cleanedRows
			.slice(1) // Skip headers
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
				row[14],
				row[15],
				row[16],
				row[17],
				row[18],
				row[19],
			]);
		// console.log("Query:", insertQuery);
		console.log("inserting data into MySQL...");
		await db.query(insertQuery, [values]);
		console.log("data inserted into MySQL successfully.");

		return NextResponse.json({
			success: true,
			message: "CSV processed successfully!",
			data: cleanedRows,
		});
	} catch (error) {
		console.error("Unexpected Error:", error);
		return NextResponse.json(
			{ error: `Unexpected error: ${(error as Error).message}` },
			{ status: 500 }
		);
	}
}
