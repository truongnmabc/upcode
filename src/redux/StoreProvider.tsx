import React from "react";
import { Provider, useStore } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function StoreProvider({ children }: { children?: React.ReactNode }) {
    const store: any = useStore();
    return (
        // <Provider store={store}>
        <PersistGate persistor={store.__persistor}>{children}</PersistGate>
        // </Provider>
    );
}
