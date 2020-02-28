<template>
    <v-card class="fill-height" :loading="isLoading" tile>
        <v-toolbar dark short color="primary">
            <v-btn icon dark @click="closePlusGroup()">
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>새 그룹 추가</v-toolbar-title>
        </v-toolbar>
        <div>
            <v-row>
                <v-col>
                    <template>
                        <v-banner>
                            추가할 위치:
                            <v-chip
                                class="ma-2"
                                outlined
                                label
                                v-if="selected.length == 0"
                                >기본 위치</v-chip
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
                        <v-banner>
                            그룹? 폴더?
                            <v-radio-group
                                v-model="isFolder"
                                class="ml-3"
                                mandatory
                            >
                                <v-radio
                                    label="폴더를 저장할 그룹"
                                    color="info"
                                    :value="false"
                                    hide-details
                                ></v-radio>
                                <v-radio
                                    label="게시글(파일)을 저장할 폴더"
                                    color="info"
                                    :value="true"
                                    hide-details
                                ></v-radio>
                            </v-radio-group>
                        </v-banner>
                        <v-banner>
                            이름
                            <v-text-field
                                v-model="newGroupName"
                                placeholder="새 그룹"
                                dense
                            ></v-text-field>
                        </v-banner>
                    </template>
                </v-col>
                <v-col>
                    <group-tree
                        :items="groups"
                        selectable="add"
                        color="warning"
                        v-model="selected"
                    ></group-tree>
                    <v-card
                        class="mx-auto"
                        outlined
                        v-if="selected.length == 0"
                        color="orange lighten-4"
                    >
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>기본 위치</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-card>
                </v-col>
            </v-row>
        </div>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                type="submit"
                large
                @click="applyPlusGroup()"
                :disabled="isError"
                >확인</v-btn
            >
        </v-card-actions>
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
        closePlusGroup() {
            this.selected = []
            this.newGroupName = ''
            this.isError = false
            this.isFolder = true
            this.$emit('close')
        },
        async applyPlusGroup() {
            this.isLoading = true

            const body = {
                name: this.newGroupName,
                isfolder: this.isFolder,
            }
            if (this.selected.length > 0) {
                body.parent_id = this.selected[0].id
            }
            await axios.post('filebox/group', body)

            this.isLoading = false
            this.$emit('change')
            this.closePlusGroup()
        },
    },
}
</script>
