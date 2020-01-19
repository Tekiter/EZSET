<template>
    <v-card tile minHeight="95%" :loading="isLoading">
        <v-toolbar flat>
            <v-toolbar-title>
                권한 설정
            </v-toolbar-title>
            <v-btn icon>
                <v-icon>mdi-delete</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card-text>
            <v-text-field
                v-model="curRole.name"
                label="이름"
                placeholder="역할 이름"
                outlined
            ></v-text-field>
            <v-divider></v-divider>
        </v-card-text>
    </v-card>
</template>
<script>
import axios from 'axios'
export default {
    props: {
        roletag: {
            type: String,
        },
    },
    data() {
        return {
            isLoading: false,
            curRole: {
                name: '',
                tag: '',
            },
        }
    },
    computed: {},
    methods: {
        async fetchRole() {
            this.isLoading = true
            const res = await axios.get(`role/${this.roletag}`)
            this.curRole.name = res.data.name
            this.isLoading = false
        },
    },
    watch: {
        roletag: {
            immediate: true,
            async handler(newVal) {
                this.curRole.tag = newVal
                await this.fetchRole()
            },
        },
    },
}
</script>
