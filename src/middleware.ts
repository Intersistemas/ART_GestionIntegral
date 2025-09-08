export { default } from "next-auth/middleware";

export const config = { matcher: ["/", "/dashboard/:path*", "/empleador/:path*", "/comercializar/:path*"] };
