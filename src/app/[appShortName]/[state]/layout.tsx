import BottomConfigTest from "@/components/bottomConfirmEndTest";
import ModalConfirm from "@/components/modalConfirmStartTest";

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            {children}
            <BottomConfigTest />
            <ModalConfirm />
        </section>
    );
}
