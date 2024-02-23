export class Sanitizer {
    public static sanitizeUrl(url: string) {
        //replace the rest of the string with "" when it finds a "&" or "|" or "%26"(encoded "&") or ";"
        return url.replace(/&.*/g, "").replace(/%26.*/g, "").replace(/\|.*/g, "").replace(/;.*/g, "");
    }
}