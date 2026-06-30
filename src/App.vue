<script setup lang="ts">
import TheTable from './components/TheTable.vue';
import { treeStoreItems } from './tree-store/data';
import { TreeStore } from './tree-store/tree-store';

const treeStore = new TreeStore(treeStoreItems);

</script>

<template>
    <main>
        <TheTable />
    </main>
</template>

<style scoped></style>
