<template>
    <div class="ma-3 fill-height">
        <v-card tile minHeight="95%">
            <v-skeleton-loader
                class="mx-auto"
                type="table"
                v-if="!calLoad && this.$perm('absence').canOwn('read')"
            ></v-skeleton-loader>
            <v-fade-transition>
                <div
                    v-if="
                        calLoad &&
                            this.$perm('attendance').canOwn('read') &&
                            this.$perm('absence').canOwn('read')
                    "
                    class="font-weight-medium subtitle-2"
                >
                    <v-container>
                        <v-row class="fill-height">
                            <v-col>
                                <v-sheet height="64">
                                    <v-toolbar flat color="white">
                                        <!-- 오늘 날짜로 이동하는 버튼 -->
                                        <v-btn
                                            outlined
                                            v-if="!isMobileMode"
                                            color="grey darken-2"
                                            @click="setToday"
                                        >
                                            Today
                                        </v-btn>
                                        <!-- 전월 이동버튼 -->
                                        <v-btn
                                            fab
                                            text
                                            small
                                            color="grey darken-2"
                                            @click="prev"
                                        >
                                            <v-icon small
                                                >mdi-chevron-left</v-icon
                                            >
                                        </v-btn>
                                        <!-- 이월 이동버튼 -->
                                        <v-btn
                                            fab
                                            text
                                            small
                                            color="grey darken-2"
                                            @click="next"
                                        >
                                            <v-icon small
                                                >mdi-chevron-right</v-icon
                                            >
                                        </v-btn>
                                        <!-- 월/주/4일/일별 선택시 기준이 되는 단위 Computed 속성에 존재-->
                                        <v-toolbar-title>{{
                                            title
                                        }}</v-toolbar-title>
                                        <v-spacer></v-spacer>

                                        <v-dialog
                                            v-model="absenceResDialog.show"
                                            persistent
                                            max-width="650"
                                        >
                                            <template v-slot:activator="{ on }">
                                                <v-btn
                                                    class="mr-1"
                                                    color="primary"
                                                    depressed
                                                    :dark="
                                                        isDarkColor('primary')
                                                    "
                                                    v-on="on"
                                                    :small="
                                                        $vuetify.breakpoint
                                                            .smAndDown
                                                    "
                                                >
                                                    <v-icon
                                                        v-if="
                                                            $vuetify.breakpoint
                                                                .xsOnly
                                                        "
                                                    >
                                                        mdi-calendar-plus
                                                    </v-icon>
                                                    <span v-else>
                                                        결석예약
                                                    </span>
                                                </v-btn>
                                            </template>
                                            <v-card>
                                                <v-row no-gutters>
                                                    <v-col cols="12" sm="6">
                                                        <v-date-picker
                                                            v-model="dates"
                                                            multiple
                                                            full-width
                                                        ></v-date-picker>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-container>
                                                            <v-menu
                                                                ref="menu"
                                                                v-model="menu"
                                                                :close-on-content-click="
                                                                    false
                                                                "
                                                                :return-value.sync="
                                                                    dates
                                                                "
                                                                transition="scale-transition"
                                                                offset-y
                                                                full-width
                                                                min-width="290px"
                                                            >
                                                                <template
                                                                    v-slot:activator="{
                                                                        //on,
                                                                    }"
                                                                >
                                                                    <v-combobox
                                                                        v-model="
                                                                            dates
                                                                        "
                                                                        multiple
                                                                        chips
                                                                        small-chips
                                                                        label="Multiple picker in menu"
                                                                        prepend-icon="mdi-plus"
                                                                        readonly
                                                                    ></v-combobox>
                                                                </template>
                                                            </v-menu>
                                                            <v-text-field
                                                                label="결석사유"
                                                                outlined
                                                                v-model="
                                                                    absence_reason
                                                                "
                                                            ></v-text-field
                                                        ></v-container>
                                                        <v-card-actions>
                                                            <v-spacer></v-spacer>
                                                            <v-btn
                                                                color="green darken-1"
                                                                text
                                                                @click="
                                                                    absenceResDialog.show = false
                                                                "
                                                                >취소</v-btn
                                                            >
                                                            <v-btn
                                                                color="green darken-1"
                                                                text
                                                                @click="
                                                                    reservation
                                                                "
                                                                >확인</v-btn
                                                            >
                                                        </v-card-actions>
                                                    </v-col>
                                                </v-row>
                                            </v-card>
                                        </v-dialog>

                                        <!-- 월/주/4일/일별을 선택하게 하는 드롭다운 메뉴 -->
                                        <v-menu
                                            bottom
                                            right
                                            v-if="!isMobileMode"
                                        >
                                            <template v-slot:activator="{ on }">
                                                <v-btn
                                                    outlined
                                                    color="grey darken-2"
                                                    v-on="on"
                                                >
                                                    <span>{{
                                                        typeToLabel[type]
                                                    }}</span>
                                                    <v-icon right
                                                        >mdi-menu-down</v-icon
                                                    >
                                                </v-btn>
                                            </template>
                                            <v-list>
                                                <v-list-item
                                                    @click="type = 'day'"
                                                >
                                                    <v-list-item-title
                                                        >Day</v-list-item-title
                                                    >
                                                </v-list-item>
                                                <v-list-item
                                                    @click="type = 'week'"
                                                >
                                                    <v-list-item-title
                                                        >Week</v-list-item-title
                                                    >
                                                </v-list-item>
                                                <v-list-item
                                                    @click="type = 'month'"
                                                >
                                                    <v-list-item-title
                                                        >Month</v-list-item-title
                                                    >
                                                </v-list-item>
                                                <v-list-item
                                                    @click="type = '4day'"
                                                >
                                                    <v-list-item-title
                                                        >4
                                                        days</v-list-item-title
                                                    >
                                                </v-list-item>
                                            </v-list>
                                        </v-menu>
                                    </v-toolbar>
                                </v-sheet>
                                <!-- 달력 디스플레이 시작 -->
                                <v-sheet height="600">
                                    <!-- @click:event="showEvent" : 항목클릭시 이벤트 지정(팝업으로 상세내용 표시) -->
                                    <!-- @click:more="viewDay" : 일력으로 넘어감
                            @click:date="viewDay" : 일력으로 넘어감 -->
                                    <v-calendar
                                        class="text-center"
                                        ref="calendar"
                                        v-model="focus"
                                        color="primary"
                                        :events="events"
                                        :event-color="getEventColor"
                                        :type="type"
                                        @click:event="showEvent"
                                        @click:more="viewDay"
                                        @click:date="viewDay"
                                        @change="updateRange"
                                    ></v-calendar>
                                    <v-menu
                                        v-model="selectedOpen"
                                        :close-on-content-click="false"
                                        :activator="selectedElement"
                                        offset-x
                                    >
                                        <!-- 항목 선택시 나오는 팝업 표시 관련 코드 -->
                                        <v-card
                                            color="grey lighten-4"
                                            min-width="350px"
                                            flat
                                        >
                                            <v-toolbar
                                                :color="selectedEvent.color"
                                                dark
                                            >
                                                <v-toolbar-title
                                                    v-html="selectedEvent.name"
                                                ></v-toolbar-title>
                                                <v-spacer></v-spacer>
                                                <v-card-actions>
                                                    <v-btn
                                                        icon
                                                        @click="
                                                            selectedOpen = false
                                                        "
                                                    >
                                                        <v-icon
                                                            >mdi-close</v-icon
                                                        >
                                                    </v-btn>
                                                </v-card-actions>
                                            </v-toolbar>
                                            <v-card-text>
                                                <span
                                                    v-html="
                                                        selectedEvent.details
                                                    "
                                                ></span>
                                                <v-row
                                                    justify="center"
                                                    v-if="
                                                        selectedEvent.name ==
                                                            '공결(승인대기)'
                                                    "
                                                >
                                                    <v-btn
                                                        @click="dialog = true"
                                                        >신청 취소</v-btn
                                                    >
                                                </v-row>
                                            </v-card-text>
                                        </v-card>
                                    </v-menu>
                                </v-sheet>
                            </v-col>
                        </v-row>
                    </v-container>
                </div>
            </v-fade-transition>
            <div>
                <v-alert
                    type="error"
                    v-if="!$perm('attendance').canOwn('read')"
                >
                    권한이 없습니다.
                </v-alert>
            </div>
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
        </v-card>
        <v-dialog v-model="dialog" max-width="290">
            <v-card>
                <v-card-title class="headline">공결 신청 취소</v-card-title>
                <v-card-text> {{ selectedEvent.reson }}</v-card-text>
                <v-card-text>신청하신 공결을 취소하시겠습니까?</v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="grey darken-1" text @click="dialog = false">
                        아니요
                    </v-btn>

                    <v-btn
                        color="primary darken-1"
                        text
                        @click="cancleAbsence(selectedEvent)"
                    >
                        예
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
// 모든 출결정보를 가지고있다가 event 배열에 이벤트를 월이 변경될 때마다 골라서 넣어주면 된다.
// 즉 모든 일정을 받아오는 API하나면 해결
// event 배열은 name,start,end,color,세부내용 을 들고있어야함
// 모든 일정을 가지고있는 배열 하나가 필요함
// 1. 모든 일정을 가지고있는 배열에 정보 받아오도록 함
// 2. event 배열에 들어가도록 데이터 가공
// 3. 팝업 창에서 세부 내용 표시 하도록
// 4. 상태별 색 관리
// 5. 필요없는 달력 기능 지우기(4day, day, week 표시 기능)
import moment from 'moment'
import axios from 'axios'
export default {
    // selectedEvent : 현재 선택된 이벤트의 정보를 가지고있음
    data: () => ({
        focus: '',
        type: 'month',
        typeToLabel: {
            month: 'Month',
            week: 'Week',
            day: 'Day',
            '4day': '4 Days',
        },
        start: null,
        end: null,
        selectedEvent: {},
        selectedElement: null,
        selectedOpen: false,
        events: [],
        //출석정보저장
        attendanceUserdata: [],
        //공결정보저장
        absenceUserdata: [],
        //결석예약
        absenceResDialog: {
            show: false,
        },
        dates: [],
        menu: false,
        absence_reason: '',
        dialog: false,
        calLoad: false,
        snackbar: {
            show: false,
            text: '',
            color: '',
        },
    }),
    async created() {
        await this.init()
    },
    computed: {
        title() {
            const { start, end } = this
            if (!start || !end) {
                return ''
            }

            const startMonth = this.monthFormatter(start)
            const endMonth = this.monthFormatter(end)
            const suffixMonth = startMonth === endMonth ? '' : endMonth

            const startYear = start.year
            const endYear = end.year
            const suffixYear = startYear === endYear ? '' : endYear

            const startDay = start.day + this.nth(start.day)
            const endDay = end.day + this.nth(end.day)

            switch (this.type) {
                case 'month':
                    return `${startMonth} ${startYear}`
                case 'week':
                case '4day':
                    return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`
                case 'day':
                    return `${startMonth} ${startDay} ${startYear}`
            }
            return ''
        },
        monthFormatter() {
            return this.$refs.calendar.getFormatter({
                timeZone: 'UTC',
                month: 'long',
            })
        },
        dayList_fab() {
            return this.dates.map(item => {
                return moment(item).format('YYYY-MM-DD')
            })
        },
        isMobileMode() {
            return this.$vuetify.breakpoint.smAndDown
        },
    },
    methods: {
        viewDay({ date }) {
            this.focus = date
            this.type = 'day'
        },
        getEventColor(event) {
            return event.color
        },
        setToday() {
            this.focus = undefined
        },
        prev() {
            this.$refs.calendar.prev()
        },
        next() {
            this.$refs.calendar.next()
        },
        showEvent({ nativeEvent, event }) {
            const open = () => {
                this.selectedEvent = event
                this.selectedElement = nativeEvent.target
                setTimeout(() => (this.selectedOpen = true), 10)
            }

            if (this.selectedOpen) {
                this.selectedOpen = false
                setTimeout(open, 10)
            } else {
                open()
            }

            nativeEvent.stopPropagation()
        },
        //기간이 변경될 시에 이벤트를 다시 가져오는 함수
        updateRange({ start, end }) {
            const events = []
            //출석현황삽입
            if (this.attendanceUserdata.length > 0) {
                this.attendanceUserdata.map(item => {
                    //출석
                    if (item.state == 'attendance') {
                        events.push({
                            name: '출석',
                            start: moment(item.date).format('YYYY-MM-DD'),
                            end: moment(item.date).format('YYYY-MM-DD'),
                            details: '출석하셨습니다!',
                            color: 'green',
                        })
                    }
                    //지각
                    if (item.state == 'late') {
                        events.push({
                            name: '지각',
                            start: moment(item.date).format('YYYY-MM-DD'),
                            end: moment(item.date).format('YYYY-MM-DD'),
                            details: '지각하셨습니다!',
                            color: 'amber',
                        })
                    }
                    //결석
                    if (item.state == 'absence') {
                        events.push({
                            name: '결석',
                            start: moment(item.date).format('YYYY-MM-DD'),
                            end: moment(item.date).format('YYYY-MM-DD'),
                            details: '결석하셨습니다!',
                            color: 'red',
                        })
                    }
                    //공결
                    if (item.state == 'official_absence') {
                        events.push({
                            name: '공결',
                            start: moment(item.date).format('YYYY-MM-DD'),
                            end: moment(item.date).format('YYYY-MM-DD'),
                            details: '공결처리되었습니다!',
                            color: 'green',
                        })
                    }
                    return { name: item.name }
                })
            }
            //공결내역삽입
            this.absenceUserdata.map(item => {
                if (
                    item.approval == false &&
                    moment(item.day).format('YYYYMMDD') >=
                        moment().format('YYYYMMDD')
                ) {
                    events.push({
                        name: '공결(승인대기)',
                        start: moment(item.day).format('YYYY-MM-DD'),
                        end: moment(item.day).format('YYYY-MM-DD'),
                        details:
                            item.reason +
                            '(의) 사유의 공결이 승인 대기중입니다.',
                        color: 'orange',
                        reason: item.reason,
                    })
                }
                //승인된 공결
                if (
                    item.approval == true &&
                    moment(item.day).format('YYYYMMDD') >=
                        moment().format('YYYYMMDD')
                ) {
                    events.push({
                        name: '공결(승인완료)',
                        start: moment(item.day).format('YYYY-MM-DD'),
                        end: moment(item.day).format('YYYY-MM-DD'),
                        details:
                            item.reason +
                            '(의) 사유의 공결이 승인 완료 되었습니다.',
                        color: 'green',
                        reason: item.reason,
                    })
                }
                return { name: item.name }
            })
            this.start = start
            this.end = end
            this.events = events
            this.calLoad = true
        },
        nth(d) {
            return d > 3 && d < 21
                ? 'th'
                : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][
                      d % 10
                  ]
        },
        rnd(a, b) {
            return Math.floor((b - a + 1) * Math.random()) + a
        },
        formatDate(a, withTime) {
            return withTime
                ? `${a.getFullYear()}-${a.getMonth() +
                      1}-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`
                : `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`
        },
        //결석예약
        async reservation() {
            if (this.absence_reason == '') {
                this.openSnackbar('사유를 확인해주세요!', 'error')
            } else if (this.dayList_fab == '') {
                this.openSnackbar('날짜를 확인해주세요!', 'error')
            } else {
                try {
                    let check_date = true
                    this.dayList_fab.forEach(item => {
                        this.absenceUserdata.forEach(ii => {
                            if (item == moment(ii.day).format('YYYY-MM-DD')) {
                                check_date = false
                                return this.openSnackbar(
                                    '같은 날짜에 이미 공결 예약을 하셨습니다.',
                                    'error'
                                )
                            }
                        })
                    })
                    if (check_date) {
                        await axios.post('absencecheck/absenceBook', {
                            Reason: this.absence_reason,
                            dayList: this.dayList_fab,
                        })
                        this.dates = [
                            this.$moment(new Date()).format('YYYY-MM-DD'),
                        ]
                        this.absence_reason = ''
                        this.absenceResDialog.show = false
                        await this.init()
                        this.openSnackbar('신청되었습니다!', 'success')
                    }
                } catch (err) {
                    //
                }
            }
        },
        //공결 신청 취소
        async cancleAbsence(selectedEvent) {
            this.selectedOpen = false
            this.dialog = false
            this.calLoad = false
            try {
                await axios.post('absencecheck/deleteAbsenceUser', {
                    reason: selectedEvent.reason,
                    day: selectedEvent.start,
                })
            } catch (err) {
                //
            }
            this.openSnackbar('취소되었습니다!', 'success')
            this.calLoad = true
            this.init()
        },
        //페이지 사용에 필요한 데이터 로드 및 표시
        async init() {
            this.calLoad = false
            const absenceData = await axios.get('absencecheck/absenceUserData')
            this.absenceUserdata = absenceData.data

            const attData = await axios.get('attendance/attendanceUserData')
            if (attData.data.length > 0) {
                this.attendanceUserdata = attData.data[0].status
            }
            this.updateRange({ start: this.start, end: this.end })
            this.calLoad = true
        },
        openSnackbar(text, color) {
            this.snackbar.text = text
            this.snackbar.color = color
            this.snackbar.show = true
        },
    },
}
</script>
