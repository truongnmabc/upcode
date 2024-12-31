import NextAuth from "next-auth";
type IAccountInfo = {
    email: string;
    picture: string;
    name: string;
    id: string;
    email_verified: boolean;
    given_name: string;
    family_name: string;
};

import jwt from "jsonwebtoken";

import CredentialsProvider from "next-auth/providers/credentials";
export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        CredentialsProvider({
            id: "token",
            name: "Credentials",
            credentials: {
                token: { label: "Token", type: "text" },
            },
            async authorize(credentials) {
                const { token } = credentials;
                if (token && typeof token === "string") {
                    const accountInfo = jwt.decode(token) as IAccountInfo;
                    return {
                        ...accountInfo,
                        image: accountInfo.picture,
                    };
                }
                return null;
            },
        }),

        CredentialsProvider({
            id: "email",
            name: "Email ",
            credentials: {
                email: { label: "Email", type: "text ", placeholder: "jsmith" },
            },
            async authorize(credentials) {
                const { email } = credentials;
                if (email) {
                    return {
                        ...email,
                        email: email,
                        image: "/images/totoro.jpg",
                        id: email,
                        name: email,
                    };
                }
                return {};
            },
        }),
    ],
    callbacks: {
        async jwt({ token }) {
            // if (user) {
            //     token.email = user.email;
            //     token.picture = user.picture;
            //     token.name = user.name;
            // }
            return token;
        },
        async session({ session }) {
            // session.user = {
            //     ...session.user,
            //     email: token.email,
            //     picture: token.picture,
            //     name: token.name,
            // };
            return session;
        },
    },
    secret: process.env.AUTH_SECRET,
});
