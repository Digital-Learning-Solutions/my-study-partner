import { useContext } from "react";
import { StoredContext } from "./StoredContext";

export const useStoredContext = () => useContext(StoredContext);
