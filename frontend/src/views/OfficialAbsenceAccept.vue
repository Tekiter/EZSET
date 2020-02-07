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
                <v-toolbar dense flat>
                    <v-toolbar-title>승인 안됨</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        color="deep-purple accent-4"
                        small
                        class="d-flex flex-row-reverse"
                        @click="Accept"
                    >
                        승인</v-btn
                    >
                </v-toolbar>
                <v-list three-line flat>
                    <v-divider></v-divider>
                    <v-list-item-group v-model="checkbox_No" multiple>
                        <v-list-item
                            v-for="item in official_absence_No_arr"
                            :key="item.name"
                        >
                            <template v-slot:default="{ active, toggle }">
                                <v-list-item-action>
                                    <v-checkbox
                                        :input-value="active"
                                        @click="toggle"
                                    ></v-checkbox>
                                </v-list-item-action>
                                <v-list-item-content>
                                    <v-list-item-title>{{
                                        item.name
                                    }}</v-list-item-title>
                                    <v-list-item-subtitle>
                                        {{ item.reason }}
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </template>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-col>
            <v-col>
                <v-toolbar dense flat>
                    <v-toolbar-title>승인 됨</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        color="deep-purple accent-4"
                        small
                        class="d-flex flex-row-reverse"
                        @click="Cancle"
                    >
                        승인취소</v-btn
                    >
                </v-toolbar>
                <v-list three-line flat>
                    <v-divider></v-divider>
                    <v-list-item-group v-model="checkbox_Yes" multiple>
                        <v-list-item
                            v-for="item in official_absence_Yes_arr"
                            :key="item.name"
                        >
                            <template v-slot:default="{ active, toggle }">
                                <v-list-item-action>
                                    <v-checkbox
                                        :input-value="active"
                                        @click="toggle"
                                    ></v-checkbox>
                                </v-list-item-action>
                                <v-list-item-content>
                                    <v-list-item-title>{{
                                        item.name
                                    }}</v-list-item-title>
                                    <v-list-item-subtitle>
                                        {{ item.reason }}
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </template>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
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
        checkbox_No: [],
        checkbox_Yes: [],
        picker_date: moment(new Date()).format('YYYY-MM-DD'),
    }),
    created() {
        this.listprint()
    },
    computed: {
        arraydays() {
            return this.Official_Absence_No.map(item => {
                return this.dayprint(item.day)
            })
        },
        official_absence_No_arr() {
            return this.Official_Absence_No.filter(d => {
                return this.dayprint(d.day) == this.dayprint(this.picker_date)
            }).map(item => {
                return { name: item.name, reason: item.reason }
            })
        },
        official_absence_Yes_arr() {
            return this.Official_Absence_Yes.filter(d => {
                return this.dayprint(d.day) == this.dayprint(this.picker_date)
            }).map(item => {
                return { name: item.name, reason: item.reason }
            })
        },
    },
    methods: {
        async listprint() {
            try {
                const cursor = await axios.get(
                    'absencecheck/officialAbsenceList'
                )
                this.Official_Absence_No = cursor.data.noanswer
                this.Official_Absence_Yes = cursor.data.yesanswer
            } catch (err) {
                console.log(err)
            }
        },
        dayprint(day) {
            return moment(day).format('YYYY-MM-DD')
        },
        dateprint(date) {
            this.picker_date = this.dayprint(date)
        },
        async Accept() {
            try {
                for (let ii of this.checkbox_No) {
                    console.log(ii)
                    console.log(this.official_absence_No_arr[ii].name)
                    await axios.post('absencecheck/officialAbsenceAccept', {
                        name: this.official_absence_No_arr[ii].name,
                        day: this.picker_date,
                        approval: true,
                    })
                }
                this.listprint()
            } catch (err) {
                console.log(err)
            }
        },
        async Cancle() {
            try {
                for (let ii of this.checkbox_Yes) {
                    await axios.post('absencecheck/officialAbsenceAccept', {
                        name: this.official_absence_Yes_arr[ii].name,
                        day: this.picker_date,
                        approval: false,
                    })
                }
                this.listprint()
            } catch (err) {
                console.log(err)
            }
        },
    },
}
</script>
