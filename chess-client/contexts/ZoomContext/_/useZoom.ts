"use client";

import { InvalidOperationError } from "chess-utils";
import { useContext } from "react";
import { ZoomContext, type ZoomContextValue } from "./ZoomContext";


export const useZoom = (): ZoomContextValue => {
    const value = useContext(ZoomContext);
    if (value === null) {
        throw new InvalidOperationError("Zoom provider missing.");
    }

    return value;
};
