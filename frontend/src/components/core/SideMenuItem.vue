<template>
    <div v-if="options.perm != false">
        <!-- {{ hasChildren }} -->
        <v-list-item
            v-if="!options.children"
            :to="options.to"
            link
            color="primary"
        >
            <v-list-item-action>
                <v-icon v-if="!isChildren">{{ options.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
                <v-list-item-title>{{ options.title }} </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action v-if="isChildren">
                <v-icon>{{ options.icon }}</v-icon>
            </v-list-item-action>
        </v-list-item>
        <v-list-group
            v-else-if="hasChildren"
            :prepend-icon="options.icon"
            :sub-group="isChildren"
        >
            <template v-slot:activator>
                <v-list-item-title>{{ options.title }}</v-list-item-title>
            </template>
            <SideMenuItem
                v-for="(option, idx) in options.children"
                :options="option"
                :key="idx"
                :is-children="true"
            />
        </v-list-group>
    </div>
</template>
<script>
export default {
    name: 'SideMenuItem',
    props: {
        options: Object,
        isChildren: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        hasChildren() {
            if (
                !Array.isArray(this.options.children) ||
                this.options.children.length == 0
            ) {
                return false
            }

            for (let item of this.options.children) {
                if (item.perm != false) {
                    return true
                }
            }
            return false
        },
    },
}
</script>
