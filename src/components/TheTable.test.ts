import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import TheTable from "./TheTable.vue";

describe("TheTable", () => {
    it("Компонент рендерится", () => {
        const wrapper = mount(TheTable, {});
        expect(wrapper.text()).toContain("MStroy");
    });
});
