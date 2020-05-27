<template>
    <div class="ma-3 pa-3 ">
        <!-- date picker -->

        <v-card
            class="ma-3 pa-3 fill-width font-weight-light"
            flat
            minHeight="95%"
            color="primary lighten-1"
            :dark="isDarkColor('primary')"
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
                            v-model="Sdate"
                            @change=";(startDayPicker = false), fetchAll()"
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
                            v-model="Edate"
                            @change=";(endDayPicker = false), fetchAll()"
                            locale="ko"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
            </v-row>
        </v-card>

        <!-- 벌점 정보 카드 출력 -->
        <v-data-iterator
            :items="infoAddedUsers"
            :search="toolbar.search"
            :loading="true"
            :items-per-page="itemsPerPage"
            :page="page"
            hide-default-footer
        >
            <template v-slot:header>
                <v-toolbar flat>
                    <v-text-field
                        v-model="toolbar.search"
                        clearable
                        solo
                        outlined
                        flat
                        hide-details
                        dense
                        label="검색"
                        prepend-inner-icon="mdi-magnify"
                    ></v-text-field>

                    <template>
                        <v-btn
                            class="mx-2"
                            color="primary"
                            depressed
                            :dark="isDarkColor('primary')"
                            v-on="on"
                            :small="$vuetify.breakpoint.smAndDown"
                            @click="addPenaltyDialog.show = true"
                        >
                            <v-icon v-if="$vuetify.breakpoint.xsOnly">
                                mdi-pencil-plus-outline
                            </v-icon>
                            <span v-else>
                                상벌점 입력
                            </span>
                        </v-btn>
                    </template>
                </v-toolbar>
            </template>
            <template v-slot:loading>
                <v-row class="mx-2">
                    <v-col v-for="i in 9" :key="i" cols="12" md="4"
                        ><v-skeleton-loader
                            type="article"
                            class="mx-auto"
                        ></v-skeleton-loader
                    ></v-col>
                </v-row>
            </template>
            <template v-slot:default="props">
                <v-row class="mx-2">
                    <v-col
                        v-for="user in props.items"
                        :key="user.username"
                        cols="12"
                        md="4"
                    >
                        <v-card outlined>
                            <div class="d-flex align-center mx-4 my-6">
                                <span class="headline">
                                    {{ user.realname }}
                                </span>
                                <span class="subtitle-1 ml-2">
                                    {{ user.username }}
                                </span>
                                <v-spacer></v-spacer>
                                <span
                                    style="color:green"
                                    class="display-1 font-weight-light ma-2"
                                    v-if="user.point >= 0"
                                    >{{ user.point }}</span
                                >
                                <span
                                    style="color:red"
                                    class="display-1 font-weight-light ma-2"
                                    v-if="user.point < 0"
                                    >{{ user.point }}</span
                                >
                                <span class="headline">{{ '점' }}</span>
                            </div>
                            <v-divider></v-divider>
                            <v-card-text>
                                <div class="d-flex flex-wrap flex-grow-1">
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        @click="showPenaltyUserDialog(user)"
                                        icon
                                        small
                                    >
                                        <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </template>
            <template v-slot:footer>
                <Pagination-footer
                    v-model="page"
                    :item-count="infoAddedUsers.length"
                    :items-per-page.sync="itemsPerPage"
                />
            </template>
        </v-data-iterator>

        <!-- 유저 벌점 정보 Dialog -->
        <v-dialog v-model="penaltyUserDialog.show" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{
                        penaltyUserDialog.user.realname
                    }}</span>
                    <v-card-subtitle>{{
                        penaltyUserDialog.user.username
                    }}</v-card-subtitle>
                </v-card-title>
                <v-card-text>
                    <v-divider></v-divider>
                    <v-skeleton-loader
                        v-if="penaltyUserDialog.isLoading"
                        class="mx-auto"
                        max-width="300"
                        type="list-item-two-line"
                    ></v-skeleton-loader>
                    <v-list v-if="penaltyUserDialog.isExist">
                        <v-list-item
                            v-for="recode in penaltyUserDialog.records"
                            :key="recode.date"
                        >
                            <template>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        <div class="d-flex">
                                            <div
                                                class=" align-center d-flex flex-wrap flex-grow-1"
                                            >
                                                {{
                                                    changeDateFormat(
                                                        recode.date
                                                    )
                                                }}
                                            </div>
                                            <div
                                                class="align-center d-flex pl-3"
                                            >
                                                {{ recode.type }}
                                            </div>
                                            <div
                                                class="align-center d-flex pl-3"
                                            >
                                                {{ recode.description }}
                                            </div>
                                            <div
                                                class="align-center d-flex pl-3"
                                            >
                                                <span
                                                    style="color:red"
                                                    class="headline font-weight-light "
                                                    v-if="recode.point < 0"
                                                    >{{ recode.point }}</span
                                                >
                                                <span
                                                    style="color:green"
                                                    class="headline font-weight-light"
                                                    v-if="recode.point >= 0"
                                                    >{{ recode.point }}</span
                                                >
                                            </div>
                                            <div class="d-flex pl-3">
                                                <v-tooltip bottom>
                                                    <template
                                                        v-slot:activator="{
                                                            on,
                                                        }"
                                                    >
                                                        <v-btn
                                                            icon
                                                            text
                                                            @click="
                                                                openDeleteItem(
                                                                    recode
                                                                )
                                                            "
                                                        >
                                                            <v-icon v-on="on">
                                                                mdi-trash-can-outline
                                                            </v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <span>삭제</span>
                                                </v-tooltip>
                                            </div>
                                        </div>
                                    </v-list-item-title>
                                </v-list-item-content>
                            </template>
                        </v-list-item>
                        <v-divider></v-divider>
                    </v-list>
                </v-card-text>
                <v-card-text v-if="!penaltyUserDialog.isExist">
                    <div class="align-center pl-3">
                        정보가 없습니다.
                    </div>
                    <v-divider></v-divider>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click.native="closePenaltyUserDialog()" text
                        >닫기</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!--출석기록삭제-->
        <v-dialog v-model="deleteDialog.show" persistent max-width="300px">
            <v-card>
                <v-card-title>
                    <span class="headline">삭제</span
                    ><v-card-subtitle>{{
                        deleteDialog.info.username
                    }}</v-card-subtitle>
                </v-card-title>
                <v-card-text>
                    해당 항목을 삭제하시겠습니까?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="deleteItem(deleteDialog.info)"
                        text
                        color="error"
                        >삭제</v-btn
                    >
                    <v-btn @click="deleteDialog.show = false" text>닫기</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="errorDialog.show" persistent max-width="300px">
            <v-card>
                <v-card-title>
                    <span class="headline">경고</span>
                </v-card-title>
                <v-card-text>
                    지각, 결석 항목은 삭제하실수 없습니다!
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="errorDialog.show = false" text>닫기</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- 벌점 추가 Dialog -->
        <v-dialog
            v-model="addPenaltyDialog.show"
            :fullscreen="isMobileMode"
            max-width="800px"
            height="600px"
        >
            <v-card :loading="addPenaltyDialog.isLoading">
                <v-card-title v-if="!isMobileMode"
                    >상벌점 추가
                    <v-spacer></v-spacer>
                    <v-fade-transition>
                        <v-toolbar-title
                            v-show="addPenaltyDialog.selections.length > 0"
                        >
                            <v-subheader
                                >{{ addPenaltyDialog.selections.length }}명
                                선택됨</v-subheader
                            >
                        </v-toolbar-title>
                    </v-fade-transition>
                </v-card-title>

                <v-toolbar v-else flat>
                    <v-btn icon @click="closeaddPenaltyDialog()">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>상벌점 추가</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn
                        outlined
                        @click="applyaddPenaltyDialog()"
                        color="primary"
                        >추가</v-btn
                    >
                </v-toolbar>
                <!--상벌점 세부항목-->

                <v-row class="justify-center" align="center" no-gutters>
                    <v-col cols="12" md="2">
                        <v-select
                            class="ma-2"
                            v-model="addPenaltyDialog.type"
                            :items="addPenaltyDialog.config"
                            :rules="[v => !!v || '필수 선택 항목입니다!']"
                            required
                            label="항목"
                        ></v-select>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-menu
                            v-model="addPenaltyDialog.datePicker"
                            :close-on-content-click="false"
                            max-width="290"
                        >
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                    class="ma-2"
                                    :value="addPenaltyDialog.date"
                                    label="date"
                                    readonly
                                    v-on="on"
                                    @click:clear="date = null"
                                ></v-text-field>
                            </template>
                            <v-date-picker
                                v-model="addPenaltyDialog.date"
                                @change="addPenaltyDialog.datePicker = false"
                                locale="ko"
                            ></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="12" md="5">
                        <v-text-field
                            class="ma-2"
                            v-model="addPenaltyDialog.description"
                            label="설명"
                            :rules="[v => !!v || '필수 작성 항목입니다!']"
                            required
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-card-text>
                    <v-text-field
                        v-model="addPenaltyDialog.search"
                        clearable
                        solo
                        outlined
                        flat
                        hide-details
                        dense
                        label="검색"
                        prepend-inner-icon="mdi-magnify"
                    ></v-text-field>
                    <v-row no-gutters>
                        <v-col
                            v-for="user in users"
                            :key="user.username"
                            v-show="
                                searchMatches(
                                    user.username,
                                    addPenaltyDialog.search
                                )
                            "
                            cols="12"
                            sm="6"
                        >
                            <v-checkbox
                                :label="`${user.realname} (${user.username})`"
                                v-model="addPenaltyDialog.selections"
                                :value="user.username"
                                hide-details
                            ></v-checkbox>
                        </v-col>
                        <v-col
                            cols="12"
                            class="text-center mt-5"
                            v-if="users.length == 0"
                        >
                            <p>추가 할 유저가 없습니다.</p>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-spacer></v-spacer>
                <v-card-actions v-if="!isMobileMode">
                    <v-spacer></v-spacer>
                    <v-fade-transition>
                        <small
                            v-show="addPenaltyDialog.message"
                            class="red--text text--darken-4 mr-3"
                            >{{ addPenaltyDialog.message }}</small
                        >
                    </v-fade-transition>

                    <v-btn @click="applyaddPenaltyDialog()" text color="primary"
                        >추가</v-btn
                    >
                    <v-btn @click="closeaddPenaltyDialog()" text>취소</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
<script>
import axios from 'axios'
import moment from 'moment'
import PaginationFooter from '../../components/misc/PaginationFooter.vue'

export default {
    components: {
        PaginationFooter,
    },
    data() {
        return {
            users: [],
            infoAddedUsers: [],
            fetchingCount: 0,
            totalCount: 0,

            itemsPerPage: 9,
            page: 1,

            toolbar: {
                search: '',
            },
            penaltyUserDialog: {
                show: false,
                user: {},
                search: '',
                records: [],
                isLoading: false,
                isExist: true,
                errorMessage: '',
            },
            addPenaltyDialog: {
                show: false,
                isLoading: false,
                search: [],
                selections: [],
                message: '',
                config: [],
                configKeyValue: [],
                type: '',
                description: '',
                date: '',
                datePicker: false,
            },
            //date-picker
            Sdate: moment()
                .startOf('month')
                .format('YYYY-MM-DD'),
            Edate: moment()
                .endOf('month')
                .format('YYYY-MM-DD'),
            startDayPicker: false,
            endDayPicker: false,
            dataLoading: false,
            deleteDialog: {
                show: false,
                info: {},
                username: '',
            },
            snackbar: {
                show: false,
                text: '',
                color: '',
            },
            penalties: [],
            userScore: [],
            errorDialog: {
                show: false,
            },
        }
    },
    computed: {
        isFetching() {
            return this.fetchingCount > 0
        },
        computedDateStart() {
            return this.Sdate
                ? moment(this.Sdate).format('YYYY 년 MM 월 DD 일')
                : ''
        },
        computedDateEnd() {
            return this.Edate
                ? moment(this.Edate).format('YYYY 년 MM 월 DD 일')
                : ''
        },
        isMobileMode() {
            return this.$vuetify.breakpoint.smAndDown
        },
    },
    methods: {
        async fetchAll() {
            this.infoAddedUsers = []
            this.fetchingCount += 1
            await this.fetchUsers()
            await this.fetchPenalty()
            await this.getUserScore()
            await this.fetchPenaltyConfig()
            this.fetchingCount -= 1
        },
        async fetchUsers() {
            this.users = []
            this.fetchingCount += 1
            try {
                const users = await axios.get('user')
                this.totalCount = users.data.total
                this.users = users.data.users
            } finally {
                this.fetchingCount -= 1
            }
        },
        async fetchPenalty() {
            this.penalties = []
            this.fetchingCount += 1
            try {
                const penalties = await axios.get(`penalty/read`)
                penalties.data.map(item => {
                    if (
                        moment(this.Sdate).format('YYYYMMDD') <=
                            moment(item.date).format('YYYYMMDD') &&
                        moment(this.Edate).format('YYYYMMDD') >=
                            moment(item.date).format('YYYYMMDD')
                    ) {
                        this.penalties.push(item)
                    }
                })
            } finally {
                this.fetchingCount -= 1
            }
        },
        async fetchPenaltyConfig() {
            this.fetchingCount += 1
            const tmp = await axios.get('penaltyconfig/read')
            var res = []
            tmp.data.forEach(element => {
                if (element.key != '지각' && element.key != '결석')
                    res.push(element.key)
            })
            this.addPenaltyDialog.config = res
            this.addPenaltyDialog.configKeyValue = tmp.data
            this.fetchingCount -= 1
        },
        async getUserScore() {
            this.infoAddedUsers = []
            let res = []
            await this.users.forEach(user => {
                let point = 0
                this.penalties.forEach(item => {
                    if (user.username == item.username) point += item.point
                })
                res.push({
                    username: user.username,
                    realname: user.realname,
                    point: point,
                })
            })
            this.infoAddedUsers = res
        },
        searchMatches(haystack, niddle) {
            return haystack.includes(niddle)
        },
        async showPenaltyUserDialog(user) {
            this.penaltyUserDialog.isLoading = true
            this.penaltyUserDialog.show = true
            this.penaltyUserDialog.user = user
            this.penaltyUserDialog.isExist = false
            const tmp = []
            this.penalties.forEach(elem => {
                if (user.username == elem.username) {
                    tmp.push({
                        date: elem.date,
                        type: elem.type,
                        description: elem.description,
                        point: elem.point,
                    })
                    this.penaltyUserDialog.isExist = true
                }
            })
            this.penaltyUserDialog.records = tmp
            this.penaltyUserDialog.isLoading = false
        },
        closePenaltyUserDialog() {
            this.penaltyUserDialog.records = []
            this.penaltyUserDialog.errorMessage = ''
            this.penaltyUserDialog.show = false
        },
        changeDateFormat(date) {
            return moment(date).format('YYYY년 MM월 DD일')
        },
        async openDeleteItem(info) {
            this.deleteDialog.show = true
            this.deleteDialog.info = info
            this.deleteDialog.username = this.penaltyUserDialog.user.username
        },
        async deleteItem(info) {
            if (info.type == '지각' || info.type == '결석') {
                this.openSnackbar(
                    '지각이나 결석항목은 삭제할 수 없습니다!',
                    'error'
                )
            } else {
                await axios.delete(`penalty/delete`, {
                    params: {
                        username: this.deleteDialog.username,
                        date: this.deleteDialog.info.date,
                        description: this.deleteDialog.info.description,
                        type: this.deleteDialog.info.type,
                    },
                })
                this.openSnackbar('삭제되었습니다', 'success')

                this.deleteDialog.show = false
                this.fetchingCount += 1
                this.fetchAll()
                this.penaltyUserDialog.show = false
                this.fetchingCount -= 1
            }
        },
        openSnackbar(text, color) {
            this.snackbar.text = text
            this.snackbar.color = color
            this.snackbar.show = true
        },
        async closeaddPenaltyDialog() {
            this.addPenaltyDialog.type = ''
            this.addPenaltyDialog.description = ''
            this.addPenaltyDialog.selections = []
            this.addPenaltyDialog.date = ''
            this.addPenaltyDialog.show = false
        },
        async applyaddPenaltyDialog() {
            if (this.addPenaltyDialog.selections.length == 0)
                this.openSnackbar('적용대상을 선택해 주세요! ', 'error')
            else if (this.addPenaltyDialog.type == '')
                this.openSnackbar('항목을 선택해 주세요! ', 'error')
            else if (this.addPenaltyDialog.date == '')
                this.openSnackbar('날짜를 선택해 주세요! ', 'error')
            else if (this.addPenaltyDialog.description == '')
                this.openSnackbar('설명을 작성해 주세요! ', 'error')
            else {
                var type_id = this.addPenaltyDialog.configKeyValue.find(
                    (item, idx) => {
                        return item.key === this.addPenaltyDialog.type
                    }
                )
                console.log(type_id)
                await axios.post('/penalty/write', {
                    type_id: type_id._id,
                    users: this.addPenaltyDialog.selections,
                    date: this.addPenaltyDialog.date,
                    description: this.addPenaltyDialog.description,
                    type: this.addPenaltyDialog.type,
                })
                this.closeaddPenaltyDialog()
                await this.fetchAll()
                this.openSnackbar('등록되었습니다', 'success')
            }
        },
    },
    async created() {
        this.fetchingCount += 1
        await this.fetchAll()
        this.fetchingCount -= 1
    },
}
</script>
