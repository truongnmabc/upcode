import BottomConfirmTest from "@/components/bottomConfirmEndTest";
import ModalConfirm from "@/components/modalConfirmStartTest";
import UserActionListen from "@/components/userAction";

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            {children}
            <BottomConfirmTest />
            <ModalConfirm />
            <UserActionListen />
        </section>
    );
}
