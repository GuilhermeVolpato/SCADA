import { NextResponse } from "next/server";
import { getLatestSensorValues } from "../../server/mqtt";

export async function GET() {
  return NextResponse.json(getLatestSensorValues());
}
