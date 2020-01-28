<template>
    <v-card>
        <v-card-title
            v-if="this.$perm('attendance').can('read')"
            class="font-weight-thin display-3"
        >
            Monthly attendance management
            <blockquote class="blockquote">
                출석, 지각, 결석, 공결 현황을 조회합니다. 날짜를 클릭할 경우,
                상세 현황을 조회하실 수 있습니다.
            </blockquote>
        </v-card-title>
        <div
            v-if="this.$perm('attendance').canOwn('read')"
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
                                    class="mr-4"
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
                                    <v-icon small>mdi-chevron-left</v-icon>
                                </v-btn>
                                <!-- 이월 이동버튼 -->
                                <v-btn
                                    fab
                                    text
                                    small
                                    color="grey darken-2"
                                    @click="next"
                                >
                                    <v-icon small>mdi-chevron-right</v-icon>
                                </v-btn>
                                <!-- 월/주/4일/일별 선택시 기준이 되는 단위 Computed 속성에 존재-->
                                <v-toolbar-title>{{ title }}</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <!-- 월/주/4일/일별을 선택하게 하는 드롭다운 메뉴 -->
                                <v-menu bottom right>
                                    <template v-slot:activator="{ on }">
                                        <v-btn
                                            outlined
                                            color="grey darken-2"
                                            v-on="on"
                                        >
                                            <span>{{ typeToLabel[type] }}</span>
                                            <v-icon right>mdi-menu-down</v-icon>
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item @click="type = 'day'">
                                            <v-list-item-title
                                                >Day</v-list-item-title
                                            >
                                        </v-list-item>
                                        <v-list-item @click="type = 'week'">
                                            <v-list-item-title
                                                >Week</v-list-item-title
                                            >
                                        </v-list-item>
                                        <v-list-item @click="type = 'month'">
                                            <v-list-item-title
                                                >Month</v-list-item-title
                                            >
                                        </v-list-item>
                                        <v-list-item @click="type = '4day'">
                                            <v-list-item-title
                                                >4 days</v-list-item-title
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
                                ref="calendar"
                                v-model="focus"
                                color="primary"
                                :events="events"
                                :event-color="getEventColor"
                                :now="today"
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
                                        <v-btn icon>
                                            <v-icon>mdi-pencil</v-icon>
                                        </v-btn>
                                        <v-toolbar-title
                                            v-html="selectedEvent.name"
                                        ></v-toolbar-title>
                                        <v-spacer></v-spacer>
                                        <v-btn icon>
                                            <v-icon>mdi-heart</v-icon>
                                        </v-btn>
                                        <v-btn icon>
                                            <v-icon>mdi-dots-vertical</v-icon>
                                        </v-btn>
                                    </v-toolbar>
                                    <v-card-text>
                                        <span
                                            v-html="selectedEvent.details"
                                        ></span>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-btn
                                            text
                                            color="secondary"
                                            @click="selectedOpen = false"
                                        >
                                            Close
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-menu>
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-container>
        </div>
        <div>
            <v-alert type="error" v-if="!$perm('attendance').can('read')">
                권한이 없습니다.
            </v-alert>
        </div>
    </v-card>
</template>
<script>
// 모든 출결정보를 가지고있다가 event 배열에 이벤트를 월이 변경될 때마다 골라서 넣어주면 된다.
// 즉 모든 일정을 받아오는 API하나면 해결
// event 배열은 name,start,end,color,세부내용 을 들고있어야함
// 모든 일정을 가지고있는 배열 하나가 필요함
// 1. 모든 일정을 가지고있는 배열에 정보 받아오도록 함
// 2. event 배열에 들어가도록 데이터 가공
// 3. 팝업 창에서 세부 내용 표시 하도록
// 4. 출석-초록 지각-주황 결석 - 빨강 공결 - 빨강
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
        attendanceUserdata: [],
    }),
    async created() {
        try {
            const res = await axios.get('attendance/attendanceUserData')
            this.attendanceUserdata = res.data[0].status
            this.updateRange(this.start, this.end)
        } catch (err) {
            console.log(err)
        }
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
    },
    mounted() {
        this.$refs.calendar.checkChange()
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
            this.focus = this.today
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
            console.log(this.date)
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
                        color: 'orange',
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
                        details: '공결하셨습니다!',
                        color: 'red',
                    })
                }
                return { name: item.name, state: item.state }
            })
            this.start = start
            this.end = end
            this.events = events
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
    },
}
</script>
