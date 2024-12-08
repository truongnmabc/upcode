import NextAuth from "next-auth";
import AppleProvider from "next-auth/providers/apple";
import GoogleProvider from "next-auth/providers/google";
// import EmailProvider from "next-auth/providers/email";

export const { auth, handlers, signIn, signOut } = NextAuth({
  secret: process.env.SECRET,
  providers: [
    AppleProvider({
      clientId: process.env.NEXT_PUBLIC_APPLE_ID || "",
      clientSecret: process.env.NEXT_PUBLIC_APPLE_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_ID || "",
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET || "",
    }),
    // EmailProvider({
    //   server: process.env.MAIL_SERVER,
    //   from: "<no-reply@example.com>",
    // }),
  ],
});
