<template v-if="true">
    <v-list-item v-if="!options.children" :to="options.to" link>
        <v-list-item-action>
            <v-icon>{{ options.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
            <v-list-item-title>{{ options.title }}</v-list-item-title>
        </v-list-item-content>
    </v-list-item>
    <v-list-group v-else :prepend-icon="options.icon">
        <template v-slot:activator>
            <v-list-item-title>{{ options.title }}</v-list-item-title>
        </template>
        <SideMenuItem
            v-for="(option, idx) in options.children"
            :options="option"
            :key="idx"
        />
    </v-list-group>
</template>
<script>
export default {
    name: 'SideMenuItem',
    props: ['options'],
}
</script>
