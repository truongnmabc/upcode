export default function ContainerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section id="ContainerLayout" className="flex-1 w-full">
            {children}
        </section>
    );
}
