<template>
    <div class="fill-height">
        <v-row no-gutters class="fill-height">
            <v-col v-show="isMobileMode" cols="12">
                <v-tabs v-model="curTab" class="mt-3" grow>
                    <v-tab>
                        자료 목록
                    </v-tab>
                    <v-tab>
                        자료
                    </v-tab>
                </v-tabs>
            </v-col>

            <v-col
                v-show="!isMobileMode || curTab == 0"
                class="fill-height"
                cols="12"
                md="3"
            >
                <v-card tile outlined class="fill-height">
                    <v-sheet class="pa-4 primary lighten-2" tile>
                        <v-text-field
                            v-model="groupSearch"
                            label="검색"
                            :dark="isDarkColor('primary')"
                            solo-inverted
                            hide-details
                            clearable
                            flat
                            prepend-inner-icon="mdi-magnify"
                            clear-icon="mdi-close-circle-outline"
                        >
                        </v-text-field>
                    </v-sheet>
                    <group-tree
                        v-model="selectedGroups"
                        :search="groupSearch"
                        :items="groups"
                        @change="groupChanged()"
                    ></group-tree>
                    <v-list v-if="checkManagePerm()">
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
            <v-col v-show="!isMobileMode || curTab == 1" class="fill-height">
                <router-view v-show="overlayMode == 'none'"></router-view>
                <v-container
                    v-show="
                        overlayMode == 'none' &&
                            selectedGroups[0] &&
                            !selectedGroups[0].isfolder
                    "
                    class="text-center"
                >
                    빈 그룹입니다.
                </v-container>
                <v-fade-transition hide-on-leave>
                    <create-group
                        v-if="overlayMode == 'add'"
                        :groups="groups"
                        @close="closePlusGroup"
                        @change="fetchGroups"
                    ></create-group>
                </v-fade-transition>
                <v-fade-transition hide-on-leave>
                    <edit-group
                        v-if="overlayMode == 'edit'"
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
            fileboxes: [],
            groups: [],
            selectedGroups: [],
            overlayMode: 'none',
            groupSearch: '',
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
            curTab: 0,
        }
    },
    async created() {
        await this.fetchGroups()
    },
    methods: {
        showEditGroup() {
            this.overlayMode = 'edit'
            this.curTab = 1
        },
        closeEditGroup() {
            this.overlayMode = 'none'
            this.fetchGroups()
            this.curTab = 0
        },
        async fetchGroups() {
            const res = await axios.get('/filebox')
            this.groups = res.data.groups
        },
        showPlusGroup() {
            this.overlayMode = 'add'
            this.curTab = 1
        },
        closePlusGroup() {
            this.overlayMode = 'none'
            this.curTab = 0
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
        checkManagePerm() {
            return this.$perm('fileBox').can('manage')
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
        isMobileMode() {
            return this.$vuetify.breakpoint.smAndDown
        },
    },
}
</script>
