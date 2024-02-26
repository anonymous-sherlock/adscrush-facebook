import { NextRequest } from "next/server";

// Define a function to perform basic authentication
export function isAuthenticated(req: NextRequest) {
    const authheader = req.headers.get("authorization") || req.headers.get("Authorization");

    if (!authheader) {
        return false;
    }

    const auth = Buffer.from(authheader.split(" ")[1], "base64").toString().split(":");
    const user = auth[0];
    const pass = auth[1];

    if (user == "adscrush" && pass == "adscrush") {
        return true;
    } else {
        return false;
    }
}