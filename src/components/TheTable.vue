<script setup lang="ts">
import { AgGridVue } from "ag-grid-vue3"; // Vue Grid Logic

import { treeStoreItems } from "@/tree-store/data";
import { TreeStore } from "@/tree-store/tree-store";
import type { Item } from "@/tree-store/types";
import {
    AllEnterpriseModule,
    ModuleRegistry,
    RowGroupingModule,
    TreeDataModule,
    type AutoGroupColumnDef,
    type ColDef
} from "ag-grid-enterprise";
import { ref } from "vue";
ModuleRegistry.registerModules([AllEnterpriseModule, RowGroupingModule, TreeDataModule,]);


const mapDataToAGGrid = (items: Item[]) => {
    const store = new TreeStore(items);
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
const columnDefs = ref<ColDef[]>([
    {
        headerName: "№п/п",
        valueGetter: "node.rowIndex + 1",
        pinned: 'left',
        width: 100,
    },
    { field: "label", headerName: "Наименование" },
]);

const defaultColDef = ref<ColDef>({
    flex: 2,
    resizable: false,
});

const autoGroupColumnDef = ref<AutoGroupColumnDef>({
    headerName: "Категория",
    valueGetter: (params) => (params.data.children?.length ? "Группа" : "Элемент"),
    cellClassRules: {
        "text-bold": (params) => params.data.children?.length,
    }
});

const rowData = ref<Item[] | null>(mappedData);
const treeDataChildrenField = ref("children");
const groupDefaultExpanded = ref(-1);
</script>

<template>
    <h2 class="text-center">MStroy | AG Grid | <a href="https://t.me/alexstekk">Александр Стекольщиков</a></h2>
    <ag-grid-vue style="width: 100%; height: 50rem;" :columnDefs="columnDefs" :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef" :rowData="rowData" :treeData="true"
        :treeDataChildrenField="treeDataChildrenField" :groupDefaultExpanded="groupDefaultExpanded"></ag-grid-vue>
</template>

<style>
.text-bold {
    font-weight: 700 !important;
}

.text-center {
    text-align: center;
}

a {
    color: currentColor;
}
</style>
