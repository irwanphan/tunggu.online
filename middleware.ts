export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*"], // Semua halaman dashboard wajib login
};
