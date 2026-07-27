import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasBlobToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
  });
}
