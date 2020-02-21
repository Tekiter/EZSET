<template>
    <v-container class="fill-height">
        <v-row style="height:30em">
            <v-col cols="12" md="3" class="fill-height">
                <v-card outlined>
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
                        outlined
                        :events="funcdays"
                        event-color=""
                        @click:date="dateprint"
                    ></v-date-picker>
                </v-card>
            </v-col>
            <v-col class="fill-height d-flex flex-column">
                <div>
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
                    <v-divider></v-divider>
                </div>

                <div class="scroll flex-grow-1">
                    <v-list three-line flat>
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
                </div>
            </v-col>
            <v-col class="fill-height d-flex flex-column">
                <div>
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
                    <v-divider></v-divider>
                </div>
                <div class="scroll flex-grow-1">
                    <v-list three-line flat class="scroll">
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
                </div>
                <v-spacer></v-spacer>
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
    </v-container>
</template>
<style scoped>
.scroll {
    overflow-y: auto;
}
</style>
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
        snackbar: {
            show: false,
            text: '',
            color: '',
        },
    }),
    created() {
        if (!this.$perm('manageRoles').can('access')) {
            this.$router.push({ name: 'error403' })
            return
        }
        this.listprint()
    },
    computed: {
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
        funcdays(date) {
            let no_map = false
            let yes_map = false
            this.Official_Absence_No.forEach(ii => {
                if (date == this.dayprint(ii.day)) no_map = true
            })
            this.Official_Absence_Yes.forEach(item => {
                if (date == this.dayprint(item.day)) yes_map = true
            })
            if (no_map && yes_map) return ['teal lighten-2', 'blue lighten-1']
            if (no_map) return 'teal lighten-2'
            if (yes_map) return 'blue lighten-1'
        },
        async listprint() {
            try {
                const cursor = await axios.get(
                    'absencecheck/officialAbsenceList'
                )
                this.Official_Absence_No = cursor.data.noanswer
                this.Official_Absence_Yes = cursor.data.yesanswer
            } catch (err) {
                //
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
                    //
                    //
                    await axios.post('absencecheck/officialAbsenceAccept', {
                        name: this.official_absence_No_arr[ii].name,
                        day: this.picker_date,
                        approval: true,
                    })
                }
                this.listprint()
                this.openSnackbar('승인완료!', 'success')
            } catch (err) {
                //
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
                this.openSnackbar('승인취소완료!', 'success')
            } catch (err) {
                //
            }
        },
        openSnackbar(text, color) {
            this.snackbar.text = text
            this.snackbar.color = color
            this.snackbar.show = true
        },
    },
}
</script>
