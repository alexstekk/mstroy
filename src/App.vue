<script setup lang="ts">
import TheTable from './components/TheTable.vue';
import { treeStoreItems } from './tree-store/data';
import { TreeStore } from './tree-store/tree-store';
import type { Item } from './tree-store/types.ts';

const mapDataToAGGrid = (items: Item[]) => {

    const store = new TreeStore(items);

    store.addItem({
        id: '777',
        parent: 4,
        label: 'Айтем 777'
    });

    store.addItem({
        id: '999',
        parent: 8,
        label: 'Айтем 999'
    });

    store.addItem({
        id: '111',
        parent: 4,
        label: 'Айтем 999'
    });

    store.removeItem("111");

    const buildNode = (item: Item) => {
        const children = store.getChildren(item.id);
        if (children.length) {
            item.children = children.map(item => buildNode(item));
        }
        return item;
    };

    const roots = items.filter(item => item.parent === null);
    return roots.map(root => buildNode(root));
};

const mappedData = mapDataToAGGrid(treeStoreItems);


</script>

<template>
    <main>
        <TheTable :data="mappedData" />
    </main>
</template>

<style scoped></style>
