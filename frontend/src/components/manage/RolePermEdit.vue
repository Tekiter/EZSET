<template>
    <v-card tile minHeight="95%" :loading="isLoading" :disabled="disabled">
        <v-toolbar flat>
            <v-toolbar-title>
                설정
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-fade-transition>
                <v-btn
                    v-if="changed"
                    outlined
                    tile
                    color="primary"
                    @click="savePerms"
                >
                    변경사항 저장
                </v-btn>
            </v-fade-transition>
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
                    :disabled="permdisabled"
                    @input="changed = true"
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
                    :disabled="permdisabled"
                    >역할 삭제</v-btn
                >
            </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <setting-select
            v-model="manageData"
            :items="manageItems"
            @change="changed = true"
            :disabled="permdisabled"
        ></setting-select>

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
import SettingSelect from './SettingSelect.vue'

// import { Role } from '../../utils/role/libs/Role'
// import { filterAllPerms } from '../../utils/role/role'

export default {
    components: {
        SettingSelect,
    },
    props: {
        roletag: {
            type: String,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            isLoading: false,
            changed: false,
            rolename: '',
            removeRoleDialog: {
                show: false,
                name: '',
                isLoading: false,
                error: '',
            },
            manageItems: [],
            manageData: {},
            roleObj: null,
        }
    },
    computed: {
        permdisabled() {
            return this.roletag === 'admin' || this.disabled
        },
    },
    methods: {
        async fetchRole() {
            this.isLoading = true
            const res = await axios.get(`role/${this.roletag}`)
            this.rolename = res.data.name
            this.manageData = this.createPermData(res.data.perm)
            this.isLoading = false
        },
        createPermData(permdata) {
            const checkAction = (arr, action) => {
                if (arr.indexOf(action) >= 0) {
                    return true
                }
                if (arr.indexOf('!' + action) >= 0) {
                    return false
                }
                return undefined
            }
            const res = {}
            for (let { key } of this.manageItems) {
                if (!key) {
                    continue
                }
                let { resource, action, range, param } = JSON.parse(key)

                range = range || 'any'
                if (permdata[resource] && permdata[resource].all) {
                    let obj = permdata[resource].all

                    let target
                    if (Array.isArray(obj)) {
                        target = obj
                    } else {
                        target = obj[range]
                    }

                    res[key] = checkAction(target, action)

                    if (param) {
                        obj = permdata[resource].params[param]
                        if (Array.isArray(obj)) {
                            target = obj
                        } else {
                            target = obj[range]
                        }

                        const po = checkAction(target, action)

                        if (po != undefined) {
                            res[key] = po
                        }
                    }
                }
            }

            return res
        },
        convertPermItems(items) {
            return items.map(item => {
                const res = { ...item }
                res.key = JSON.stringify(item.target)
                return res
            })
        },

        async savePerms() {
            this.isLoading = true

            // 권한 수정 목록 구축
            const perms = []
            for (let key of Object.keys(this.manageData)) {
                let { resource, action, range, param } = JSON.parse(key)
                perms.push({
                    allow: this.manageData[key] ? true : false,
                    resource,
                    action,
                    param,
                    range: range || 'any',
                })
            }

            await axios.patch(`role/${this.roletag}`, {
                name: this.rolename,
                perms,
            })

            this.changed = false

            this.$emit('change')

            this.isLoading = false
        },

        // 역할 삭제 Dialog
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
                this.changed = false
                await this.fetchRole()
            },
        },
    },
    async created() {
        const res = await axios.get('role/managepage')
        this.manageItems = this.convertPermItems(res.data)
    },
}
</script>
