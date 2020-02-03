<template>
    <v-container class="fill-height">
        <v-row>
            <v-col cols="3" class="fill-height">
                <v-card>
                    <!-- 날짜 선택하는 date picker부분-->
                    <v-card-title>
                        날짜 선택
                    </v-card-title>
                    <v-card-text>
                        {{ picker_date }}
                    </v-card-text>
                    <v-date-picker
                        full-width
                        class="mt-0"
                        no-title
                        :events="arraydays"
                        event-color="green lighten-1"
                        @click:date="dateprint"
                    ></v-date-picker>
                </v-card>
            </v-col>
            <v-col>
                <v-row>
                    <v-col>
                        승인되지 않은 목록
                        <v-btn text color="deep-purple accent-4">
                            승인
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <!--사람들 목록 출력하는 data table 부분-->
                    <v-col cols="" class="fill-height">
                        <v-card>
                            <template>
                                <v-data-table
                                    :headers="headers"
                                    :items="official_absence_arr"
                                    :items-per-page="5"
                                    class="elevation-1"
                                    disable-sort
                                >
                                    <tr>
                                        <td></td>
                                    </tr>
                                </v-data-table>
                            </template>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
            <v-col>
                <v-row>
                    <v-col>
                        승인된 목록
                        <v-btn text color="deep-purple accent-4">
                            승인취소
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <!--사람들 목록 출력하는 data table 부분-->
                    <v-col cols="" class="fill-height">
                        <v-card>
                            <template>
                                <v-data-table
                                    :headers="headers"
                                    :items="official_absence_arr"
                                    :items-per-page="5"
                                    class="elevation-1"
                                    disable-sort
                                >
                                    <tr>
                                        <td></td>
                                    </tr>
                                </v-data-table>
                            </template>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import moment from 'moment'
import axios from 'axios'
export default {
    data: () => ({
        Official_Absence_No: [],
        Official_Absence_Yes: [],
        checkbox: [],
        picker_date: moment(new Date()).format('YYYY-MM-DD'),
        headers: [
            {
                text: 'Name',
                align: 'left',
                sortable: false,
                value: 'name',
            },
            { text: 'Reason', value: 'reason' },
            { text: '', align: 'right', value: 'checkbox' },
        ],
    }),
    async created() {
        try {
            const cursor = await axios.get('absencecheck/officialAbsenceList')
            this.Official_Absence_No = cursor.data.noanswer
            this.Official_Absence_Yes = cursor.data.yesanswer
        } catch (err) {
            console.log(err)
        }
    },
    computed: {
        arraydays() {
            return this.Official_Absence_No.map(item => {
                return this.dayprint(item.day)
            })
        },
        official_absence_arr() {
            return this.Official_Absence_No.filter(d => {
                console.log(this.dayprint(d.day))
                console.log(this.dayprint(this.picker_date))
                console.log(this.picker_date)
                return this.dayprint(d.day) == this.dayprint(this.picker_date)
            }).map(item => {
                return { name: item.name, reason: item.reason }
            })
        },
    },
    methods: {
        dayprint(day) {
            return moment(day).format('YYYY-MM-DD')
        },
        dateprint(date) {
            this.picker_date = this.dayprint(date)
        },
    },
}
</script>
