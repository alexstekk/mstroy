<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
import TheWelcome from './components/TheWelcome.vue';
import { treeStoreItems } from './tree-store/data';
import { TreeStore } from './tree-store/tree-store';

const treeStore = new TreeStore(treeStoreItems);
// console.log("treeStore.getChildren(1);", treeStore.getChildren(1));
// console.log("treeStore.getAllChildren(1)", treeStore.getAllChildren(1));
// console.log("treeStore.getAllChildren(4)", treeStore.getAllChildren(4));
// console.log("treeStore.getAllParents(7)", treeStore.getAllParents(7));
treeStore.addItem({
    id: '5',
    parent: "91064cee",
    label: 'NEW ITEM'
});

</script>

<template>
    <header>
        <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

        <div class="wrapper">
            <HelloWorld msg="You did it!" />
        </div>
    </header>

    <main>
        <TheWelcome />
    </main>
</template>

<style scoped>
header {
    line-height: 1.5;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }
}
</style>
