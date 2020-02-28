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
                                    @click="deleteGroup()"
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
            try {
                //await axios.delete('filebox/group')
            } catch {
                //
            }
        },
    },
}
</script>
