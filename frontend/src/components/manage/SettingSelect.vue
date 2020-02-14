<template>
    <v-list :disabled="disabled">
        <template v-for="(item, idx) of items">
            <!-- header 타입 -->
            <v-subheader
                v-if="item.type == 'header'"
                :key="`setiing-select-item-${idx}`"
            >
                {{ item.title }}
            </v-subheader>

            <!-- switch 타입 -->
            <v-list-item
                v-else-if="item.type == 'switch'"
                :key="`setiing-select-item-${idx}`"
            >
                <v-list-item-content>
                    <v-list-item-title>
                        {{ item.title }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{ item.content }}
                    </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                    <v-switch
                        v-if="item.key"
                        v-model="settingValues[item.key]"
                        @change="valueChanged(item.key)"
                    ></v-switch>
                </v-list-item-action>
            </v-list-item>

            <!-- text 타입 -->
            <v-list-item
                v-else-if="item.type == 'text'"
                :key="`setiing-select-item-${idx}`"
            >
                <v-list-item-content>
                    <v-list-item-title>
                        {{ item.title }}
                    </v-list-item-title>
                    <v-text-field
                        v-if="item.key"
                        :value="settingValues[item.key]"
                        @input="
                            settingValues[item.key] = $event
                            valueChanged(item.key)
                        "
                        class="mt-1 mb-1"
                        outlined
                        hide-details
                        dense
                    ></v-text-field>
                    <v-list-item-subtitle>
                        {{ item.content }}
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <!-- line 타입 -->
            <v-divider
                v-else-if="item.type == 'line'"
                :key="`setiing-select-item-${idx}`"
            ></v-divider>
        </template>
    </v-list>
</template>
<script>
export default {
    props: {
        items: {
            type: Array,
            default: () => [],
        },
        value: {
            type: Object,
            default: () => ({}),
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        settingValues: {},
    }),
    methods: {
        parseKeys(arr) {
            for (let item of arr) {
                if (item.key) {
                    this.settingValues[item.key] = null
                }
            }
        },
        valueChanged(key, value) {
            this.$emit('input', { ...this.settingValues })
            this.$emit('change')
        },
    },
    watch: {
        items(arr) {
            // this.parseKeys(arr)
        },
        value(val) {
            this.settingValues = { ...val }
        },
    },
    created() {
        // this.parseKeys(this.items)
        this.settingValues = { ...this.value }
    },
}
</script>
