import { useState } from "react";
export default function useClipboard(resetTime = 2000) {
    const [copiedId, setCopiedId] = useState(null);

    const copyToClipboard = async (text, id) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), resetTime);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };
    return { copiedId, copyToClipboard };
};