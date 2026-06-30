// treeStore.test.ts
import { describe, expect, it } from "vitest";
import { TreeStore } from "./tree-store";
import type { Item } from "./types";

const mockItems: Item[] = [
    { id: 1, parent: null, label: "Айтем 1" },
    { id: "91064cee", parent: 1, label: "Айтем 2" },
    { id: 3, parent: 1, label: "Айтем 3" },
    { id: 4, parent: "91064cee", label: "Айтем 4" },
    { id: 5, parent: "91064cee", label: "Айтем 5" },
    { id: 6, parent: "91064cee", label: "Айтем 6" },
    { id: 7, parent: 4, label: "Айтем 7" },
    { id: 8, parent: 4, label: "Айтем 8" },
];

describe("TreeStore", () => {
    describe("Базовое", () => {
        it("getAll() - должен вернуть все элементы", () => {
            const store = new TreeStore(mockItems);
            const all = store.getAll();
            expect(all).toEqual(mockItems);
        });

        it("getItem() должен возвращать элемент или null", () => {
            const store = new TreeStore(mockItems);
            expect(store.getItem(1)).toEqual(mockItems[0]);
            expect(store.getItem("91064cee")).toEqual(mockItems[1]);
            expect(store.getItem(999)).toBeNull();
        });
    });

    describe("getChildren()", () => {
        it("должен возвращать прямых потомков для узла с детьми", () => {
            const store = new TreeStore(mockItems);
            const children = store.getChildren(1);
            expect(children).toHaveLength(2);
        });

        it("должен возвращать пустой массив для узла без детей", () => {
            const store = new TreeStore(mockItems);
            expect(store.getChildren(3)).toEqual([]);
        });

        it("должен возвращать пустой массив для неверного id", () => {
            const store = new TreeStore(mockItems);
            expect(store.getChildren(999)).toEqual([]);
        });
    });

    describe("getAllChildren()", () => {
        it("должен возвращать всех детей", () => {
            const store = new TreeStore(mockItems);
            const allChildren = store.getAllChildren(1);
            const expectedIds = ["91064cee", 3, 4, 5, 6, 7, 8];
            expect(allChildren).toHaveLength(expectedIds.length);
            const ids = allChildren.map((item) => item.id);
            expect(ids).toEqual(expectedIds);
        });

        it("должен возвращать пустой массив для ноды без детей", () => {
            const store = new TreeStore(mockItems);
            expect(store.getAllChildren(7)).toEqual([]);
        });

        it("должен выбрасывать ошибку при вызове без id", () => {
            const store = new TreeStore(mockItems);
            // @ts-expect-error нет аргумента в getAllChildren()
            expect(() => store.getAllChildren()).toThrow("Неверные данные, ожидается id");
        });
    });

    describe("getAllParents()", () => {
        it("должен возвращать вернуть всех родителей", () => {
            const store = new TreeStore(mockItems);
            const parentsOf7 = store.getAllParents(7);
            // 7 - 4 - 91064cee -> 1
            const expectedIds = [7, 4, "91064cee", 1];
            expect(parentsOf7.map((item) => item.id)).toEqual(expectedIds);
        });

        it("для рута должен возвращать массив только с ним", () => {
            const store = new TreeStore(mockItems);
            const parents = store.getAllParents(1);
            expect(parents).toHaveLength(1);
            // @ts-expect-error mock - ok
            expect(parents[0].id).toBe(1);
        });

        it("должен стрелять ошибку без id", () => {
            const store = new TreeStore(mockItems);
            // @ts-expect-error нет id у getAllParents()
            expect(() => store.getAllParents()).toThrow("Неверные данные, ожидается id");
        });
    });

    describe("addItem()", () => {
        it("должен добавлять новый элемент", () => {
            const store = new TreeStore(mockItems);
            const newItem: Item = { id: 9, parent: 8, label: "Айтем 9" };
            store.addItem(newItem);

            expect(store.getItem(9)).toEqual(newItem);
            expect(store.getChildren(8)).toContainEqual(newItem);
            expect(store.getAll()).toHaveLength(mockItems.length + 1);
        });

        it("должен стрелять ошибку при попытке добавить элемент с уже существующим id", () => {
            const store = new TreeStore(mockItems);
            const duplicate = { id: 1, parent: null, label: "" };
            expect(() => store.addItem(duplicate)).toThrow("Элемент с таким id уже существует");
        });
    });

    describe("removeItem()", () => {
        it("должен удалять элемент и всех его потомков", () => {
            const store = new TreeStore(mockItems);
            store.removeItem("91064cee");

            const ids = store.getAll().map((item) => item.id);
            expect(ids).not.toContain("91064cee");
            expect(ids).not.toContain(4);
            expect(ids).not.toContain(5);
            expect(ids).not.toContain(6);
            expect(ids).not.toContain(7);
            expect(ids).not.toContain(8);
            // должны остаться 1 3
            expect(ids).toContain(1);
            expect(ids).toContain(3);
        });

        it("должен стрелять ошибку при удалении несуществующего id", () => {
            const store = new TreeStore(mockItems);
            expect(() => store.removeItem(999)).toThrow("Элемент с таким id не существует");
        });
    });

    describe("updateItem()", () => {
        it("должен обновлять элемент", () => {
            const store = new TreeStore(mockItems);
            const updated = { id: 4, parent: "91064cee", label: "!!! Айтем 4" };
            store.updateItem(updated);

            const item = store.getItem(4);
            expect(item).toMatchObject(updated);
        });

        it("должен выбрасывать ошибку при обновлении несуществующего id", () => {
            const store = new TreeStore(mockItems);
            const fake = { id: 999, parent: null, label: "Несуществующий" };
            expect(() => store.updateItem(fake)).toThrow("Элемент с таким id не существует");
        });
    });

    // Дополнительный тест на корректность работы с произвольными полями
    it("должен корректно хранить и возвращать произвольные поля", () => {
        const itemsWithExtra: Item[] = [
            { id: 1, parent: null, label: "Root", extra: "value", count: 42 },
        ];
        const store = new TreeStore(itemsWithExtra);
        const item = store.getItem(1);
        expect(item).toHaveProperty("extra", "value");
        expect(item).toHaveProperty("count", 42);
    });
});
