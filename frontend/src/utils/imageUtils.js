import { API_BASE_URL } from "../config/config";

/**
 * Returns full URL for profile/image path from API.
 * If path is already absolute (http/https) returns as-is; otherwise prepends API_BASE_URL.
 */
export function getImageUrl(path) {
    if (!path) return null;
    if (typeof path !== "string") return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = API_BASE_URL.replace(/\/$/, "");
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${base}${normalized}`;
}
