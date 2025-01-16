import { generateRandomNegativeId } from "../../src/utils/math";

describe("Test Random Negative ID Generator", () => {
    it("should generate a negative ID", () => {
        const id = generateRandomNegativeId();
        expect(id).toBeLessThan(0); // ID phải là số âm
    });

    it("should not generate the excluded ID", () => {
        const excludedId = -100;
        const id = generateRandomNegativeId(excludedId);
        expect(id).not.toBe(excludedId); // ID không được trùng với giá trị bị loại trừ
    });

    it("should generate unique IDs in multiple calls", () => {
        const ids = new Set();
        for (let i = 0; i < 100; i++) {
            ids.add(generateRandomNegativeId());
        }
        expect(ids.size).toBe(100); // Tất cả các ID phải duy nhất
    });

    it("should generate a valid negative ID when no exclude value is provided", () => {
        const id = generateRandomNegativeId();
        expect(id).toBeLessThan(0); // ID phải là số âm
    });

    it("should handle edge cases for excluded ID", () => {
        const excludedId = -999;
        const id = generateRandomNegativeId(excludedId);
        expect(id).not.toBe(excludedId); // ID không được trùng với giá trị loại trừ
        expect(id).toBeLessThan(0); // ID phải là số âm
    });
});
