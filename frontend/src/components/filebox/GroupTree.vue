<template>
    <v-treeview
        :open="open"
        :items="items"
        activatable
        item-key="id"
        :open-on-click="!selectable"
        :item-disabled="selectable ? 'isfolder' : null"
        :color="color"
        :value="value"
        @update:active="onChange"
        return-object
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
        color: {
            type: String,
            default: 'primary',
        },
        value: {
            type: Array,
            default: () => [],
        },
    },
    data: () => ({
        open: ['public'],
        tree: [],
    }),
    methods: {
        onChange() {
            this.$emit('input', arguments[0])
            this.$emit('change')
        },
    },
}
</script>