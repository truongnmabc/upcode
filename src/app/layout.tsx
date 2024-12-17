import { Poppins, Vampiro_One } from "next/font/google";

const vampiro = Vampiro_One({
    weight: ["400"],
    style: "normal",
    preload: true,
    display: "swap",
    variable: "--font-vampiro",
    subsets: ["latin"],
});

const poppins = Poppins({
    weight: ["400", "500", "600", "700"],
    style: "normal",
    preload: true,
    display: "swap",
    variable: "--font-poppins",
    subsets: ["latin"],
});
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`${vampiro?.variable} ${poppins?.variable} font-sans`}
        >
            <body>{children}</body>
        </html>
    );
}
