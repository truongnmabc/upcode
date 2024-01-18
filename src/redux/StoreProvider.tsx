import React, { useRef } from "react";
import { Persistor } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./store";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    const persistRef = useRef<Persistor>();
    if (!persistRef.current) {
        persistRef.current = persistor;
    }
    return <PersistGate persistor={persistRef.current}>{children}</PersistGate>;
}
