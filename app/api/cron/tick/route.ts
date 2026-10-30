import { NextResponse, type NextRequest } from "next/server";

import { expireStaleInstagramConnections } from "@/lib/instagram/accounts";
import { getCronSecret } from "@/lib/instagram/config";
import { isAuthorizedCronRequest } from "@/lib/instagram/cron-auth";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  if (
    !isAuthorizedCronRequest(
      request.headers.get("authorization"),
      getCronSecret(),
    )
  ) {
    return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  }

  const tokens = await expireStaleInstagramConnections();

  return NextResponse.json({ tokens });
}
