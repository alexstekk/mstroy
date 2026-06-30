<script setup lang="ts">
import { LucideSend, Phone } from '@lucide/vue';
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
        <footer>
            <span>
                Александр Стекольщиков
            </span>
            <div class="contacts">
                <a href="https://t.me/alexstekk">
                    <LucideSend />
                </a> |
                <a href="tel:+79181531367">
                    <Phone />
                </a>
            </div>
        </footer>
    </main>
</template>

<style scoped>
main {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    flex-grow: 1;
}

footer {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: 0.75rem;
}

.contacts {
    display: flex;
    gap: 1rem;
    align-items: center;
    color: white;
}
</style>
