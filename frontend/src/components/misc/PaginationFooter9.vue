<template>
    <!-- Desktop UI -->
    <div class="d-flex align-center ma-3" v-if="$vuetify.breakpoint.mdAndUp">
        <div class="side"></div>
        <div class="flex-grow-1">
            <v-pagination
                :value="value"
                @input="$emit('input', $event)"
                :length="length"
            />
        </div>
        <div class="side">
            <v-select
                class="mt-0 pt-0"
                :value="itemsPerPage"
                @input="$emit('update:items-per-page', $event)"
                :items="ippExample"
                item-text="state"
                item-value="value"
                hide-details
                outlined
                dense
            >
            </v-select>
        </div>
    </div>

    <!-- Mobile UI -->
    <div class="ma-5" v-else>
        <v-select
            class="mt-0 pt-0"
            :value="itemsPerPage"
            @input="$emit('update:items-per-page', $event)"
            :items="ippExample"
            item-text="state"
            item-value="value"
            hide-details
            outlined
            dense
        >
        </v-select>
        <v-pagination
            class="mt-3"
            :value="value"
            @input="$emit('input', $event)"
            :length="length"
        />
    </div>
</template>
<style scoped>
.side {
    max-width: 10em;
    width: 10em;
}
</style>
<script>
export default {
    props: {
        value: {
            type: Number,
            default: 1,
        },
        itemCount: {
            type: Number,
            default: 0,
        },
        itemsPerPage: {
            type: Number,
            default: 9,
        },
        itemsPerPageExample: {
            type: Array,
            default: () => [9, 18, 36, 72],
        },
    },
    data: () => ({}),
    computed: {
        length() {
            return Math.ceil(this.itemCount / this.itemsPerPage)
        },
        ippExample() {
            return this.itemsPerPageExample.map(n => {
                return { state: `${n}개씩 보기`, value: n }
            })
        },
    },
}
</script>
