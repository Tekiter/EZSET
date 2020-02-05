<template>
    <v-treeview
        v-model="tree"
        :open="open"
        :items="items"
        activatable
        item-key="name"
        :open-on-click="!selectable"
    >
        <template v-slot:prepend="{ item, open }">
            <v-icon
                v-if="!item.isfolder"
            >{{ open ? 'mdi-package-variant' : 'mdi-package-variant-closed' }}</v-icon>
            <v-icon v-else>{{ 'mdi-folder-multiple-outline' }}</v-icon>
        </template>
    </v-treeview>
</template>
<script>
export default {
    props: {
        items: {
            type: Array,
            default: () => [],
        },
        selectable: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        open: ['public'],
        tree: [],
    }),
}
</script>