<template>
    <v-card class="fill-height">
        <v-toolbar dark short color="primary">
            <v-btn icon dark @click="closeEditGroup()">
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>그룹 편집</v-toolbar-title>
        </v-toolbar>
        <div>
            <v-row>
                <v-col>
                    <template>
                        <v-banner>
                            <v-chip
                                class="ma-2"
                                outlined
                                label
                                v-if="selected.length == 0"
                                >편집할 그룹을 선택하세요</v-chip
                            >
                            <v-chip
                                class="ma-2"
                                outlined
                                label
                                v-if="selected.length > 0"
                            >
                                {{ selected[0].name }}
                            </v-chip>
                        </v-banner>
                        <v-banner v-if="selected.length > 0">
                            이름 수정하기
                            <v-text-field
                                v-model="newGroupName"
                                dense
                            ></v-text-field>
                            <v-btn
                                small
                                color="blue darken-1"
                                dark
                                @click="ChangeGroupName()"
                                >수정</v-btn
                            >
                        </v-banner>
                        <v-banner v-if="selected.length > 0">
                            <div class="my-2">
                                <v-btn
                                    small
                                    color="error"
                                    @click="removeGroupDialog.show = true"
                                    >삭제하기</v-btn
                                >
                            </div>
                        </v-banner>
                    </template>
                </v-col>
                <v-col>
                    <group-tree
                        :items="groups"
                        selectable="edit"
                        color="warning"
                        v-model="selected"
                    ></group-tree>
                </v-col>
            </v-row>
        </div>
        <v-dialog
            v-model="removeGroupDialog.show"
            max-width="500px"
            v-if="selected.length > 0"
        >
            <v-card :loading="removeGroupDialog.isLoading">
                <v-card-title>그룹 삭제</v-card-title>

                <v-card-text>
                    <p>
                        그룹을 삭제하려면 삭제하려는 그룹 이름을 한번 더 입력해
                        주세요.
                    </p>
                    <v-text-field
                        label="이름 재입력"
                        v-model="removeGroupDialog.name"
                        :placeholder="selected[0].name"
                        :error-messages="removeGroupDialog.error"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click.native="deleteGroup()" text color="error"
                        >삭제</v-btn
                    >
                    <v-btn @click.native="removeGroupDialog.show = false" text
                        >취소</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>
<script>
import GroupTree from './GroupTree.vue'
import axios from 'axios'

export default {
    components: { GroupTree },
    props: {
        groups: {
            type: Array,
            default: () => [],
        },
    },
    data: () => ({
        selected: [],
        newGroupName: '',
        isError: false,
        isFolder: true,
        isLoading: false,
        removeGroupDialog: {
            show: false,
            isLoading: false,
            error: '',
        },
    }),
    methods: {
        closeEditGroup() {
            this.$emit('close')
        },
        async ChangeGroupName() {
            try {
                this.isLoading = true

                const body = {
                    name: this.newGroupName,
                    isfolder: this.isFolder,
                }
                if (this.selected.length > 0) {
                    body.parent_id = this.selected[0].id
                }
                await axios.patch('/filebox/group/' + this.selected[0].id, body)
                this.$emit('close')
            } catch {
                //
            }
        },
        async deleteGroup() {
            if (this.removeGroupDialog.name === this.selected[0].name) {
                try {
                    this.removeGroupDialog.isLoading = true
                    await axios.delete('/filebox/group/' + this.selected[0].id)
                    this.removeGroupDialog.isLoading = false
                    this.$emit('close')
                } catch (error) {
                    this.removeGroupDialog.error = '삭제에 실패했습니다.'
                    console.log(error)
                }
            } else {
                this.removeGroupDialog.error = '역할 이름이 일치하지 않습니다.'
                this.removeGroupDialog.name = ''
            }
        },
    },
}
</script>
