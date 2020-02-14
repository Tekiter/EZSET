<template>
    <div class="fill-height">
        <v-row no-gutters class="fill-height">
            <v-col class="fill-height" :cols="3" xl="2">
                <v-card tile outlined class="fill-height">
                    <group-tree
                        v-model="showMetarials.selected"
                        :items="groups"
                        @change="isFolder()"
                    ></group-tree>
                    <v-list>
                        <v-list-item link @click="showPlusGroup()">
                            <v-list-item-icon>
                                <v-icon>mdi-plus</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title class="grey--text">새 그룹 추가</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
            <v-col class="fill-height">
                <v-card v-if="plusGroup.show" class="fill-height">
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
                                            v-if="plusGroup.selected.length == 0"
                                        >기본 위치</v-chip>
                                        <v-chip
                                            class="ma-2"
                                            outlined
                                            label
                                            v-if="plusGroup.selected.length > 0"
                                        >{{plusGroup.selected[0].name}}</v-chip>
                                    </v-banner>
                                    <v-banner>
                                        그룹? 폴더?
                                        <v-radio-group class="ml-3" mandatory>
                                            <v-radio
                                                label="폴더를 저장할 그룹"
                                                color="info"
                                                @change="isFolderFalse()"
                                                hide-details
                                            ></v-radio>
                                            <v-radio
                                                label="게시글(파일)을 저장할 폴더"
                                                color="info"
                                                @change="isFolderTrue()"
                                                hide-details
                                            ></v-radio>
                                        </v-radio-group>
                                    </v-banner>
                                    <v-banner>
                                        이름
                                        <v-text-field
                                            v-model="plusGroup.name"
                                            placeholder="새 그룹"
                                            dense
                                        ></v-text-field>
                                    </v-banner>
                                </template>
                            </v-col>
                            <v-col>
                                <group-tree
                                    :items="groups"
                                    selectable
                                    color="warning"
                                    v-model="plusGroup.selected"
                                ></group-tree>
                                <v-card
                                    class="mx-auto"
                                    max-width="400"
                                    outlined
                                    v-if="plusGroup.selected.length == 0"
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
                        >확인</v-btn>
                    </v-card-actions>
                </v-card>
                <div class="mr-4">
                    <div class="text-center">
                        <v-btn class="mx-2" block dark large color="cyan" v-if="showMetarials.show">
                            Upload
                            <v-icon right dark>mdi-cloud-upload</v-icon>
                        </v-btn>
                    </div>
                    <material-post
                        v-if="showMetarials.show"
                        :folderId="this.showMetarials.selected[0].id"
                    ></material-post>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import axios from 'axios'
import GroupTree from '../components/filebox/GroupTree.vue'
import MaterialPost from '../components/filebox/MaterialPost.vue'

export default {
    components: {
        GroupTree,
        MaterialPost,
    },
    data() {
        return {
            fileboxes: [],
            groups: [],
            plusGroup: {
                show: false,
                parent: '',
                name: '',
                isfolder: false,
                selected: [],
            },
            showMetarials: {
                show: false,
                selected: [],
            },
            errors: {
                name: '',
                parent: '',
            },
            isloading: false,
        }
    },
    async created() {
        this.patch()
    },
    methods: {
        async patch() {
            const res = await axios.get('/filebox')
            console.log(res)
            this.groups = res.data.groups
        },
        showPlusGroup() {
            this.plusGroup.show = true
        },
        closePlusGroup() {
            this.plusGroup.show = false
            this.plusGroup.name = ''
            this.plusGroup.isfolder = false
            this.plusGroup.selected = []
        },
        async applyPlusGroup() {
            this.isloading = true
            try {
                const body = {
                    name: this.plusGroup.name,
                    isfolder: this.plusGroup.isfolder,
                }
                if (this.plusGroup.selected.length > 0) {
                    body.parent_id = this.plusGroup.selected[0].id
                }
                await axios.post('filebox/group', body)
                this.closePlusGroup()
                this.patch()
            } catch (error) {
                if (error.response.status == 409) console.log(error.response) // eslint-disable-line no-console
            } finally {
                this.isloading = false
            }
        },
        isFolderTrue() {
            this.plusGroup.isfolder = true
        },
        isFolderFalse() {
            this.plusGroup.isfolder = false
        },
        isFolder() {
            if (this.showMetarials.selected[0].isfolder == true) {
                this.showMetarials.show = true
            }
        },
    },
    computed: {
        isError() {
            //이름이 설정된 경우에만 확인버튼 클릭 가능
            if (this.plusGroup.name != '') {
                return false
            }
            return true
        },
    },
}
</script>
