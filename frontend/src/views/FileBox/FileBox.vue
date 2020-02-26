<template>
    <div class="fill-height">
        <v-row no-gutters class="fill-height">
            <v-col class="fill-height" :cols="3" xl="2">
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
                    <v-list>
                        <v-list-item link @click="showPlusGroup()">
                            <v-list-item-icon>
                                <v-icon>mdi-plus</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title class="grey--text"
                                >새 그룹 추가</v-list-item-title
                            >
                        </v-list-item>
                        <v-list-item link @click="showModifyGroup()">
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
                <router-view v-if="!plusGroup.show"></router-view>
                <v-fade-transition hide-on-leave>
                    <create-group
                        v-if="plusGroup.show"
                        :groups="groups"
                        @close="closePlusGroup"
                        @change="fetchGroups"
                    ></create-group>
                </v-fade-transition>

                <!-- 밑에거 안보임 (지울예정) -->
                <div v-if="false">
                    <v-card v-if="modifyGroup.show" class="fill-height">
                        <v-toolbar dark short color="primary">
                            <v-btn icon dark @click="closePlusGroup()">
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
                                                v-if="
                                                    plusGroup.selected.length ==
                                                        0
                                                "
                                                >기본 위치</v-chip
                                            >
                                            <v-chip
                                                class="ma-2"
                                                outlined
                                                label
                                                v-if="
                                                    plusGroup.selected.length >
                                                        0
                                                "
                                            >
                                                {{ plusGroup.selected[0].name }}
                                            </v-chip>
                                        </v-banner>
                                        <v-banner
                                            v-if="plusGroup.selected.length > 0"
                                        >
                                            수정하기
                                            <v-text-field
                                                v-model="modifyNow"
                                                dense
                                            ></v-text-field>
                                            <v-btn
                                                small
                                                color="blue darken-1"
                                                dark
                                                >수정</v-btn
                                            >
                                        </v-banner>
                                        <v-banner
                                            v-if="plusGroup.selected.length > 0"
                                        >
                                            <div class="my-2">
                                                <v-btn small color="error"
                                                    >삭제하기</v-btn
                                                >
                                            </div>
                                        </v-banner>
                                    </template>
                                </v-col>
                                <v-col>
                                    <group-tree
                                        :items="groups"
                                        selectable
                                        color="warning"
                                        v-model="plusGroup.selected"
                                        @change="clickEvent()"
                                    ></group-tree>
                                    <v-card
                                        class="mx-auto"
                                        outlined
                                        v-if="plusGroup.selected.length == 0"
                                        color="orange lighten-4"
                                    >
                                        <v-list-item>
                                            <v-list-item-content>
                                                <v-list-item-title
                                                    >기본
                                                    위치</v-list-item-title
                                                >
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </div>
                    </v-card>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import axios from 'axios'
import GroupTree from '../../components/filebox/GroupTree.vue'
import CreateGroup from '../../components/filebox/CreateGroup.vue'

export default {
    components: {
        GroupTree,
        CreateGroup,
    },
    data() {
        return {
            group_id: '',
            modifyNow: '',
            fileboxes: [],
            groups: [],
            selectedGroups: [],
            groupSearch: '',
            plusGroup: {
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
        this.fetchGroups()
    },
    methods: {
        clickEvent() {
            this.group_id = this.plusGroup.selected[0].id
            this.modifyNow = this.plusGroup.selected[0].name
        },
        showModifyGroup() {
            this.plusGroup.show = false
            this.modifyGroup.show = true
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
