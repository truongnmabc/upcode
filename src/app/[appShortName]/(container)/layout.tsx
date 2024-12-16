export default function ContainerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="flex-1 w-full mx-auto max-w-page">
            {children}
        </section>
    );
}
