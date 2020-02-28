<template>
    <div class="fill-height">
        <v-row no-gutters class="fill-height">
            <v-col class="fill-height" :cols="3" xl="2">
                <v-card tile outlined class="fill-height">
                    <group-tree
                        v-model="selectedGroups"
                        :items="groups"
                        @change="groupChanged()"
                    ></group-tree>
                    <v-list>
                        <v-list-item link @click="showPlusGroup()">
                            <v-list-item-icon>
                                <v-icon>mdi-plus</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title class="grey--text"
                                >새 그룹 추가</v-list-item-title
                            >
                        </v-list-item>
                        <v-list-item link @click="showEditGroup()">
                            <v-list-item-icon>
                                <v-icon>mdi-map-search</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title class="grey--text"
                                >그룹 편집</v-list-item-title
                            >
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
            <v-col class="fill-height">
                <router-view v-show="!plusGroup.show"></router-view>
                <v-fade-transition hide-on-leave>
                    <create-group
                        v-if="plusGroup.show"
                        :groups="groups"
                        @close="closePlusGroup"
                        @change="fetchGroups"
                    ></create-group>
                </v-fade-transition>
                <router-view v-show="!editGroup.show"></router-view>
                <v-fade-transition hide-on-leave>
                    <edit-group
                        v-if="editGroup.show"
                        :groups="groups"
                        @close="closeEditGroup"
                        @change="fetchGroups"
                    ></edit-group>
                </v-fade-transition>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import axios from 'axios'
import GroupTree from '../../components/filebox/GroupTree.vue'
import CreateGroup from '../../components/filebox/CreateGroup.vue'
import EditGroup from '../../components/filebox/EditGroup.vue'

export default {
    components: {
        GroupTree,
        CreateGroup,
        EditGroup,
    },
    data() {
        return {
            group_id: '',
            modifyNow: '',
            fileboxes: [],
            groups: [],
            selectedGroups: [],
            plusGroup: {
                show: false,
            },
            editGroup: {
                show: false,
            },
            modifyGroup: {
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
            createMaterial: {
                show: false,
            },
            editMaterial: {
                show: false,
                material: undefined,
            },
        }
    },
    async created() {
        await this.fetchGroups()
    },
    methods: {
        clickEvent() {
            this.group_id = this.plusGroup.selected[0].id
            this.modifyNow = this.plusGroup.selected[0].name
        },
        showEditGroup() {
            this.modifyGroup.show = false
            this.editGroup.show = true
        },
        closeEditGroup() {
            this.modifyGroup.show = true
            this.editGroup.show = false
            this.fetchGroups()
        },
        async fetchGroups() {
            const res = await axios.get('/filebox')
            this.groups = res.data.groups
        },
        showPlusGroup() {
            this.modifyGroup.show = false
            this.plusGroup.show = true
        },
        closePlusGroup() {
            this.plusGroup.show = false
            this.plusGroup.name = ''
            this.plusGroup.isfolder = false
            this.plusGroup.selected = []
        },
        isFolderTrue() {
            this.plusGroup.isfolder = true
        },
        isFolderFalse() {
            this.plusGroup.isfolder = false
        },
        groupChanged() {
            // if (this.showMetarials.selected[0].isfolder == true) {
            //     this.showMetarials.show = true
            // } else {
            //     this.showMetarials.show = false
            // }
            // this.createMaterial.show = false
            if (
                this.selectedGroups.length > 0 &&
                this.selectedGroups[0].isfolder
            ) {
                this.$router.push({
                    name: 'fileBoxMaterials',
                    params: { folder_id: this.selectedGroups[0].id },
                })
            } else {
                this.$router.push({ name: 'fileBoxEmpty' })
            }
        },
        showCreateMaterial() {
            this.createMaterial.show = true
            this.showMetarials.show = false
        },
        closeCreateMaterial() {
            this.createMaterial.show = false
            this.showMetarials.show = true
        },
        async showEditMaterial(options) {
            try {
                this.editMaterial.show = true
                this.showMetarials.show = false
                this.editMaterial.material = options
            } catch {
                //
            }
        },
        closeEditMaterial() {
            this.editMaterial.show = false
            this.showMetarials.show = true
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
