<script setup lang="ts">
import type { Item } from "@/tree-store/types";
import {
    AllEnterpriseModule,
    ModuleRegistry,
    themeQuartz,
    TreeDataModule,
    type AutoGroupColumnDef,
    type ColDef
} from "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
ModuleRegistry.registerModules([AllEnterpriseModule, TreeDataModule,]);

// Мб избыточно
export interface MappedItem extends Item {
    children?: Item[] | null;
}

export interface Props {
    data: MappedItem[];
}

const { data } = defineProps<Props>();
const borderColor = 'oklch(0 0 0 / 0.15)';
const border = { style: 'solid', width: 1, color: borderColor };

const myTheme = themeQuartz.withParams({
    wrapperBorder: false,
    headerRowBorder: border,
    headerColumnBorder: border,
    borderColor: borderColor,
    rowBorder: border,

});

const columnDefs = ref<ColDef[]>([
    {
        headerName: "№п/п",
        valueGetter: "node.rowIndex + 1",
        pinned: 'left',
        width: 100,
        cellClass: "text-bold",
        cellStyle: { borderRight: "none" }
    },
    {
        field: "label",
        headerName: "Наименование",
        cellClassRules: {
            "text-bold": (params) => params.data.children?.length,
        },
    },
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
    },
});

const rowData = ref<Item[] | null>(data);
const treeDataChildrenField = ref("children");
const groupDefaultExpanded = ref(-1);
</script>

<template>
    <h1 class="text-center">MStroy | AG Grid</h1>
    <ag-grid-vue style="width: 100%; height: 50rem;" :columnDefs="columnDefs" :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef" :rowData="rowData" :treeData="true" :theme="myTheme"
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
