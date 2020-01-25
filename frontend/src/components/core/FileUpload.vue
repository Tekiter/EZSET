<template>
    <div>
        <v-file-input
            v-model="fileinput"
            show-size
            multiple
            chips
        ></v-file-input>
        <p v-if="loading">업로드중...</p>
    </div>
</template>

<script>
export default {
    props: {
        value: Array,
        loading: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            fileinput: [],
        }
    },
    methods: {},
    watch: {
        value(val) {
            this.fileinput = val
        },
        fileinput(val) {
            this.$emit('input', val)
        },
    },
}
</script>
