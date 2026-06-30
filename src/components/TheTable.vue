<script lang="ts" setup>
import { AllCommunityModule, ModuleRegistry, type ColDef } from 'ag-grid-community';
import { AgGridVue } from 'ag-grid-vue3';
import { ref } from 'vue';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);


// Row Data Interface
interface IRow {
    make: string;
    model: string;
    price: number;
    electric: boolean;
}

const rowData = ref<IRow[]>([
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
]);

const colDefs = ref<ColDef<IRow>[]>([
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "electric" },
]);

const defaultColDef = {
    flex: 1,
};
</script>

<template>
    <ag-grid-vue style="flex: 1 1 auto; height: 600px" :columnDefs="colDefs" :rowData="rowData"
        :defaultColDef="defaultColDef">
    </ag-grid-vue>
</template>

<style scoped></style>
