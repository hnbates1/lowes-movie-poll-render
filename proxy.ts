import { NextResponse } from "next/server";
import { SITE_CLOSES_AT } from "./app/movies";

export function proxy() {
  if (Date.now() >= Date.parse(SITE_CLOSES_AT)) {
    return new NextResponse("This movie poll has ended.", {
      status: 410,
      headers: {
        "cache-control": "no-store",
        "content-type": "text/plain; charset=utf-8",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
