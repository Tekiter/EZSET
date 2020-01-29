<template>
    <v-card tile minHeight="95%" :loading="isLoading">
        <v-toolbar flat>
            <v-toolbar-title>
                설정
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn outlined tile color="primary">변경사항 저장</v-btn>
        </v-toolbar>
        <v-list>
            <v-subheader>기본 설정</v-subheader>
            <v-list-item>
                <v-text-field
                    v-model="rolename"
                    label="이름"
                    placeholder="역할 이름"
                    outlined
                    hide-details
                ></v-text-field>
            </v-list-item>
            <v-list-item>
                <v-subheader>태그: {{ roletag }}</v-subheader>
                <v-spacer></v-spacer>
                <v-btn
                    outlined
                    tile
                    color="error"
                    @click="showRemoveRoleDialog"
                    :disabled="roletag === 'admin'"
                    >역할 삭제</v-btn
                >
            </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-dialog v-model="removeRoleDialog.show" max-width="500px">
            <v-card :loading="removeRoleDialog.isLoading">
                <v-card-title>역할 삭제</v-card-title>

                <v-card-text>
                    <p>
                        역할을 삭제하려면 삭제하려는 역할 이름을 한번 더 입력해
                        주세요.
                    </p>
                    <v-text-field
                        label="이름 재입력"
                        v-model="removeRoleDialog.name"
                        :placeholder="rolename"
                        :error-messages="removeRoleDialog.error"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        @click.native="applyRemoveRoleDialog()"
                        text
                        color="error"
                        >삭제</v-btn
                    >
                    <v-btn @click.native="removeRoleDialog.show = false" text
                        >취소</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>
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
            rolename: '',
            removeRoleDialog: {
                show: false,
                name: '',
                isLoading: false,
                error: '',
            },
        }
    },
    computed: {},
    methods: {
        async fetchRole() {
            this.isLoading = true
            const res = await axios.get(`role/${this.roletag}`)
            this.rolename = res.data.name
            this.isLoading = false
        },
        showRemoveRoleDialog() {
            this.removeRoleDialog.show = true
            this.removeRoleDialog.name = ''
        },
        async applyRemoveRoleDialog() {
            if (this.rolename === this.removeRoleDialog.name) {
                try {
                    this.removeRoleDialog.isLoading = true
                    await axios.delete(`role/${this.roletag}`)
                    this.removeRoleDialog.show = false
                    this.$emit('removed')
                } catch (error) {
                    this.removeRoleDialog.error = '삭제에 실패했습니다.'
                } finally {
                    this.removeRoleDialog.isLoading = false
                }
            } else {
                this.removeRoleDialog.error = '역할 이름이 일치하지 않습니다.'
            }
        },
    },
    watch: {
        roletag: {
            immediate: true,
            async handler(newVal) {
                await this.fetchRole()
            },
        },
    },
}
</script>
