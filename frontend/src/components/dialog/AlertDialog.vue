<template>
    <v-dialog :value="show">
        <v-card>
            <v-card-title>
                {{ title }}
            </v-card-title>
            <v-card-text>
                {{ content }}
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="close">확인</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: '',
        },
        content: {
            type: String,
            default: '',
        },
        value: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            show: false,
        }
    },
    methods: {
        close() {
            this.show = false
        },
    },
    watch: {
        value(val) {
            this.show = val
        },
        show(val) {
            this.$emit('input', val)
        },
    },
}
</script>
