import { useContext } from "react";
import { DiscussionContext } from "./DiscussionContext";

export const useDiscussionContext = () => useContext(DiscussionContext);
