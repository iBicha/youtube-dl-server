import { Sanitizer } from "../../src/sanitizer";

describe('Sanitizer', () => {
    it("should remove && from url", () => {
        const url = "https://www.youtube.com/watch?v=12345&&feature=youtu.be";
        expect(Sanitizer.sanitizeUrl(url)).toBe("https://www.youtube.com/watch?v=12345");
    });

    it("should remove | from url", () => {
        const url = "https://www.youtube.com/watch?v=12345|ls -la";
        expect(Sanitizer.sanitizeUrl(url)).toBe("https://www.youtube.com/watch?v=12345");
    });

    it("should remove ; from url", () => {
        const url = "https://www.youtube.com/watch?v=12345;ls -la";
        expect(Sanitizer.sanitizeUrl(url)).toBe("https://www.youtube.com/watch?v=12345");
    });

    it("should remove %26 from url", () => {
        const url = "https://www.youtube.com/watch?v=12345%26feature=youtu.be";
        expect(Sanitizer.sanitizeUrl(url)).toBe("https://www.youtube.com/watch?v=12345");
    });

    it("should remove everything all ", () => {
        const url = "https://www.youtube.com/watch?v=12345%26||&feature=youtu.be&;|ls -la|";
        expect(Sanitizer.sanitizeUrl(url)).toBe("https://www.youtube.com/watch?v=12345");
    });

})