import replaceYear from "../../src/utils/replaceYear";
describe("replace year test", () => {
    const olrYearText = "Events from 2021, 2022, and 2020 are here.";
    it("old year", () => {
        expect(replaceYear(olrYearText)).toEqual(
            "Events from 2025, 2025, and 2025 are here."
        );
    });
    const currentYearText = "Events from 2025";

    it("current year", () => {
        expect(replaceYear(currentYearText)).toEqual("Events from 2025");
    });

    const nextYearText = "Next year 2026";

    it("next year", () => {
        expect(replaceYear(nextYearText)).toEqual("Next year 2026");
    });

    const notYear = "Check not year";

    it("paragraph not year", () => {
        expect(replaceYear(notYear)).toEqual("Check not year");
    });
});
