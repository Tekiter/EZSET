<template>
    <div class="ma-3 fill-height" align="center">
        <v-row :no-gutters="isMobileMode" class="fill-height" justify="center">
            <v-col cols="12" md="9" class="fill-height">
                <v-card
                    :loading="curPenalty.isLoading"
                    :disabled="curUser.username === 'default'"
                    tile
                    minHeight="95%"
                    outlined
                >
                    <v-card-title>
                        <span class="headline">{{ curUser.realname }}</span>
                        <v-card-subtitle>{{
                            curUser.username
                        }}</v-card-subtitle>
                        <v-spacer></v-spacer>
                        <span
                            style="color:green"
                            class="display-2 font-weight-light ma-2"
                            v-if="Totalscore >= 0"
                            >{{ Totalscore }}</span
                        >
                        <span
                            style="color:red"
                            class="display-2 font-weight-light ma-2"
                            v-if="Totalscore < 0"
                            >{{ Totalscore }}</span
                        >
                        <span class="headline">{{ '점' }}</span>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card
                        class="pa-3 fill-width font-weight-light"
                        flat
                        minHeight="95%"
                        color="primary lighten-1"
                        :dark="isDarkColor('primary')"
                        v-show="!curPenalty.isLoading"
                    >
                        <v-row align="center">
                            <v-col cols="12" lg="5">
                                <v-menu
                                    v-model="startDayPicker"
                                    :close-on-content-click="false"
                                    max-width="290"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                            :value="computedDateStart"
                                            clearable
                                            label="Start date"
                                            readonly
                                            v-on="on"
                                            @click:clear="date = null"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        v-model="curPenalty.start_date"
                                        @change="
                                            ;(startDayPicker = false),
                                                fetchPenalties()
                                        "
                                        locale="ko"
                                    ></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="12" lg="2" class="text-center">
                                <v-icon x-large>
                                    mdi-arrow-right-circle
                                </v-icon>
                            </v-col>
                            <v-col cols="12" lg="5">
                                <v-menu
                                    v-model="endDayPicker"
                                    :close-on-content-click="false"
                                    max-width="290"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                            :value="computedDateEnd"
                                            clearable
                                            label="End date"
                                            readonly
                                            v-on="on"
                                            @click:clear="date = null"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        v-model="curPenalty.end_date"
                                        @change="
                                            ;(endDayPicker = false),
                                                fetchPenalties()
                                        "
                                        locale="ko"
                                    ></v-date-picker>
                                </v-menu>
                            </v-col>
                        </v-row>
                    </v-card>
                    <v-divider></v-divider>
                    <template v-if="curPenalty.isLoading">
                        <v-skeleton-loader
                            v-for="i in 7"
                            :key="`role-loading-${i}`"
                            type="data-table"
                        ></v-skeleton-loader>
                    </template>
                    <v-skeleton-loader
                        class="mx-auto"
                        type="table"
                        v-if="curPenalty.isLoading"
                    ></v-skeleton-loader>
                    <v-data-table
                        :headers="datatable.headers"
                        :items="curPenalty.penalties"
                        sort-by="date"
                        class="elevation-1"
                        v-if="!curPenalty.isLoading"
                    >
                        <template v-slot:item.point="{ item }">
                            <v-chip :color="getColor(item.point)" dark>{{
                                item.point
                            }}</v-chip>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
        <v-snackbar
            v-model="snackbar.show"
            :timeout="2000"
            :color="snackbar.color"
        >
            {{ snackbar.text }}
            <v-btn text @click="snackbar = false">
                닫기
            </v-btn>
        </v-snackbar>
    </div>
</template>
<style scoped>
.fill-screen {
    min-height: 95%;
}
</style>
<script>
import axios from 'axios'
import moment from 'moment'
import { PenaltyConfigService } from './../../service/penaltyConfig.service'
import { PenaltyService } from './../../service/penalty.service'
export default {
    data() {
        return {
            fetchingCount: 0,
            users: [],
            curTab: 0,
            penaltyConfig: [],
            curUser: {
                username: '',
                realname: '',
            },
            curPenalty: {
                penalties: [],
                isLoading: false,
                search: '',
                selections: [],
                isActionOpen: false,
                start_date: moment()
                    .startOf('month')
                    .format('YYYY-MM-DD'),
                end_date: moment()
                    .endOf('month')
                    .format('YYYY-MM-DD'),
            },
            startDayPicker: false,
            endDayPicker: false,

            datatable: {
                dialog: false,
                headers: [
                    { text: '분류', value: 'type' },
                    { text: '날짜', value: 'date' },
                    { text: '비고', value: 'description', sortable: false },
                    { text: '점수', value: 'point' },
                ],
            },
            errorDialog: {
                show: false,
            },
            snackbar: {
                show: false,
                text: '',
                color: '',
            },
            Totalscore: 0,
        }
    },
    computed: {
        isLoading() {
            return this.fetchingCount > 0
        },
        isMobileMode() {
            return this.$vuetify.breakpoint.smAndDown
        },
        computedDateStart() {
            return this.curPenalty.start_date
                ? moment(this.curPenalty.start_date).format(
                      'YYYY 년 MM 월 DD 일'
                  )
                : ''
        },
        computedDateEnd() {
            return this.curPenalty.end_date
                ? moment(this.curPenalty.end_date).format('YYYY 년 MM 월 DD 일')
                : ''
        },
    },
    methods: {
        async fetchUserList() {
            this.fetchingCount += 1
            try {
                const users = await axios.get('/user')
                this.users = users.data.users
            } finally {
                this.fetchingCount -= 1
            }
        },
        async fetchPenaltyConfigList() {
            this.fetchingCount += 1
            try {
                this.penaltyConfig = await PenaltyConfigService.getPenaltyConfig()
            } finally {
                this.fetchingCount -= 1
            }
        },
        async fetchPenalties() {
            this.curPenalty.isLoading = true
            this.curPenalty.penalties = await this.getPenalties(this.curUser)
            this.Totalscore = 0
            this.curPenalty.penalties.forEach(element => {
                element.date = moment(element.date).format('YYYY년 MM월 DD일')
            })
            for (let penalty of this.curPenalty.penalties) {
                for (let penaltyConfig of this.penaltyConfig) {
                    if (penalty.type == penaltyConfig.key)
                        penalty.point = penaltyConfig.value
                }
            }

            this.curPenalty.penalties.forEach(element => {
                this.Totalscore += parseInt(element.point)
            })

            this.curPenalty.isLoading = false
        },
        async getPenalties(curUser) {
            return await PenaltyService.getPenalty(
                curUser.username,
                this.curPenalty.start_date,
                this.curPenalty.end_date
            )
        },
        async getUser() {
            var res = await axios.get('/mypage')
            this.curUser.username = res.data.username
            this.curUser.realname = res.data.realname
            await this.fetchPenalties()
        },
        searchMatches(haystack, niddle) {
            return haystack.includes(niddle || '')
        },
        openSnackbar(text, color) {
            this.snackbar.text = text
            this.snackbar.color = color
            this.snackbar.show = true
        },
        getPointColor(point) {
            if (point >= 0) return 'success'
            else return 'error'
        },
        getColor(val) {
            if (val >= 0) return 'success'
            else return 'error'
        },
    },

    async created() {
        if (!this.$perm('penalty').can('read')) {
            this.$router.push({ name: 'error403' })
            return
        }
        this.fetchingCount += 1
        await this.fetchPenaltyConfigList()
        await this.getUser()
        this.fetchingCount -= 1
    },
}
</script>
