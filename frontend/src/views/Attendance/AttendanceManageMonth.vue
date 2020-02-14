<template>
    <div class="ma-3 pa-3 fill-width">
        <v-skeleton-loader
            class="mx-auto"
            type="table"
            v-if="!tabLoad && this.$perm('attendance').can('update')"
        ></v-skeleton-loader>
        <div
            v-if="tabLoad && this.$perm('attendance').can('update')"
            class="fill-height"
        >
            <v-card tile minHeight="95%">
                <v-container>
                    <v-row>
                        <v-col cols="12" lg="5">
                            <v-menu
                                v-model="menu1"
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
                                    @change="menu1 = false"
                                    locale="ko"
                                ></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="12" lg="2" class="text-center">
                            <v-icon>
                                mdi-arrow-right-circle
                            </v-icon>
                        </v-col>
                        <v-col cols="12" lg="5">
                            <v-menu
                                v-model="menu2"
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
                                    @change="menu2 = false"
                                    locale="ko"
                                ></v-date-picker>
                            </v-menu>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </div>

        <div>
            <v-data-table
                :headers="headers"
                :items="dataItems"
                item-key="day"
                class="elevation-1 font-weight-medium headline"
                :search="search"
                :custom-filter="filterOnlyCapsText"
                v-if="tabLoad && this.$perm('attendance').can('update')"
            >
                <template v-slot:item="{ item, headers }">
                    <tr>
                        <td v-for="(header, idx) in headers" :key="idx">
                            <template v-if="header.value == 'day'">
                                <div class="my-2">
                                    <v-btn
                                        @click="
                                            $router.push(
                                                `/AttendanceManageDay/${
                                                    item[header.value]
                                                }`
                                            )
                                        "
                                        text
                                        >{{ item[header.value] }}</v-btn
                                    >
                                </div>
                            </template>
                            <template v-else>
                                <v-icon
                                    color="green"
                                    v-if="item[header.value] == 'attendance'"
                                    >mdi-checkbox-blank-circle-outline</v-icon
                                >
                                <v-icon
                                    color="orange"
                                    v-else-if="item[header.value] == 'late'"
                                    >mdi-triangle-outline</v-icon
                                >
                                <v-icon
                                    color="red"
                                    v-else-if="item[header.value] == 'absence'"
                                    >mdi-close</v-icon
                                >
                                <v-icon
                                    color="green"
                                    v-else-if="
                                        item[header.value] == 'official_absence'
                                    "
                                    >mdi-close-circle-outline</v-icon
                                >
                            </template>
                        </td>
                    </tr>
                </template>
                <template v-slot:body.append>
                    <tr>
                        <td>Total(출석/지각/결석/공결)</td>
                        <td v-for="(item, idx) in total" :key="idx">
                            {{ item.v1 }}/{{ item.v2 }}/{{ item.v3 }}/{{
                                item.v4
                            }}
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div>
            <v-alert type="error" v-if="!$perm('attendance').can('update')">
                권한이 없습니다.
            </v-alert>
        </div>
    </div>
</template>
<script>
import moment from 'moment'
import axios from 'axios'
export default {
    async created() {
        try {
            const res = await axios.get('attendance/attendanceUserList')
            this.userList = res.data
        } catch (err) {
            //console.log(err)
        }
        try {
            const res = await axios.get('attendance/attendanceDayList')
            this.attendanceDayData = res.data
        } catch (err) {
            //console.log(err)
        }
        try {
            const res = await axios.get('attendance/attendanceUserListData')
            this.attendanceUserData = res.data
        } catch (err) {
            //console.log(err)
        }
        this.tabLoad = true
    },
    data() {
        return {
            search: '',
            calories: '',
            attendanceDayData: [],
            attendanceUserData: [],
            userList: [],
            //date-picker
            Sdate: moment()
                .startOf('month')
                .format('YYYY-MM-DD'),
            Edate: moment()
                .endOf('month')
                .format('YYYY-MM-DD'),
            menu1: false,
            menu2: false,
            tabLoad: false,
        }
    },
    computed: {
        headers() {
            const cols = this.userList.map(user => {
                return { text: user.username, value: user.username }
            })
            return [
                {
                    text: '날짜',
                    value: 'day',
                    filter: value => {
                        if (!this.NSdate) return true
                        else if (
                            parseInt(value) <= parseInt(this.NEdate) &&
                            parseInt(value) >= parseInt(this.NSdate)
                        )
                            return true
                        else return false
                    },
                },
                ...cols,
            ]
            // return [{ text: '날짜', value: 'day' }].concat(cols)
        },
        total() {
            const cols = this.userList.map(user => {
                return { name: user.username, v1: 0, v2: 0, v3: 0, v4: 0 }
            })
            cols.forEach(user => {
                this.attendanceDayData
                    .filter(val => {
                        return (
                            parseInt(val.day) >= parseInt(this.NSdate) &&
                            parseInt(val.day) <= parseInt(this.NEdate)
                        )
                    })
                    .map(item => {
                        item.status.forEach(st => {
                            if (st.name == user.name) {
                                if (st.state == 'attendance') user.v1 += 1
                                else if (st.state == 'late') user.v2 += 1
                                else if (st.state == 'absence') user.v3 += 1
                                else if (st.state == 'official_absence')
                                    user.v4 += 1
                            }
                        })
                    })
            })
            return cols
        },
        dataItems() {
            return this.attendanceDayData.map(item => {
                const output = {
                    day: item.day,
                }
                item.status.forEach(st => {
                    output[st.name] = st.state
                })
                return output
            })
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
        NSdate() {
            var tmp = this.Sdate.split('-')
            return tmp[0].concat(tmp[1], tmp[2])
        },
        NEdate() {
            var tmp = this.Edate.split('-')
            return tmp[0].concat(tmp[1], tmp[2])
        },
    },
    methods: {
        filterOnlyCapsText(value, search, item) {
            return (
                value != null &&
                search != null &&
                typeof value === 'string' &&
                value
                    .toString()
                    .toLocaleUpperCase()
                    .indexOf(search) !== -1
            )
        },
    },
}
</script>
