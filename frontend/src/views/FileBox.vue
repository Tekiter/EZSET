<template>
    <div class="fill-height">
        <v-row no-gutters class="fill-height">
            <v-col class="fill-height" :cols="3" xl="2">
                <v-card tile outlined class="fill-height">
                    <group-tree :items="groups"></group-tree>
                    <v-list>
                        <v-list-item link @click="showPlusGroupDialog()">
                            <v-list-item-icon>
                                <v-icon>mdi-plus</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title class="grey--text">새 그룹 추가</v-list-item-title>
                        </v-list-item>
                    </v-list>
                    <v-dialog v-model="plusGroupDialog.show" max-width="400" class="fill-height">
                        <v-card>
                            <v-toolbar dark short color="primary">
                                <v-btn icon dark @click="closePlusGroupDialog()">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                                <v-toolbar-title>새 그룹 추가</v-toolbar-title>
                            </v-toolbar>
                            <div>
                                <group-tree :items="groups" selectable></group-tree>저장위치
                                그룹인지 폴더인디
                            </div>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="blue darken-4"
                                    type="submit"
                                    text
                                    large
                                    @click="applyPlusGroupDialog()"
                                >확인</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card>
            </v-col>
            <v-col>
                <div>
                    <!-- :files="post.files" -->
                    <file-download></file-download>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import axios from 'axios'
import GroupTree from '../components/filebox/GroupTree.vue'

export default {
    components: {
        GroupTree,
    },
    data() {
        return {
            fileboxes: [],
            groups: [],
            plusGroupDialog: {
                show: false,
                isfolder: false,
            },
        }
    },
    async created() {
        const res = await axios.get('/filebox')
        console.log(res)
        this.groups = res.data.groups
    },
    methods: {
        async plusGroup() {},
        showPlusGroupDialog() {
            this.plusGroupDialog.show = true
        },
        closePlusGroupDialog() {
            this.plusGroupDialog.show = false
        },
        async applyPlusGroupDialog() {},
    },
}
</script>
