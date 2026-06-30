<script setup lang="ts">
import { AgGridVue } from "ag-grid-vue3"; // Vue Grid Logic

import { treeStoreItems } from "@/tree-store/data";
import { TreeStore } from "@/tree-store/tree-store";
import type { Item } from "@/tree-store/types";
import {
    AllEnterpriseModule,
    LicenseManager,
    ModuleRegistry,
    RowGroupingModule,
    TreeDataModule,
    type AutoGroupColumnDef,
    type ColDef,
    type GridReadyEvent
} from "ag-grid-enterprise";
import { ref } from "vue";
ModuleRegistry.registerModules([AllEnterpriseModule, RowGroupingModule, TreeDataModule,]);
LicenseManager.setLicenseKey("<your license key>");



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

console.log("mappedData", mappedData);

const columnDefs = ref<ColDef[]>([

    { field: "label", headerName: "Наименование" },
]);

const defaultColDef = ref<ColDef>({
    flex: 1,
});

const autoGroupColumnDef = ref<AutoGroupColumnDef>({
    headerName: "Категория",
    valueGetter: (params) => (params.data.children?.length ? "Группа" : "Элемент"),
    cellRendererParams: {
        suppressCount: true,
    },

});

const rowData = ref<any[] | null>(mappedData);
const treeDataChildrenField = ref("children");
const groupDefaultExpanded = ref(-1);
const onGridReady = (params: GridReadyEvent) => {
    gridApi.value = params.api;
};

</script>

<template>
    <ag-grid-vue style="width: 100%; height: 50rem;" @grid-ready="onGridReady" :columnDefs="columnDefs"
        :defaultColDef="defaultColDef" :autoGroupColumnDef="autoGroupColumnDef" :rowData="rowData" :treeData="true"
        :treeDataChildrenField="treeDataChildrenField" :groupDefaultExpanded="groupDefaultExpanded"></ag-grid-vue>
</template>
