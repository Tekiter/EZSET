<template>
    <v-container>
        <v-row>
            <v-col>
                <div class="d-flex flex-row mb-6">
                    승인되지 않은 목록
                </div></v-col
            >
            <v-col class="d-flex flex-row-reverse">
                <v-btn text color="deep-purple accent-4">
                    승인
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col
                cols="12"
                md="3"
                sm="6"
                v-for="(item, index) in Official_Absence_No"
                :key="index"
            >
                <v-card>
                    <v-card-title>{{ item.name }}</v-card-title>
                    <v-card-subtitle>{{ dayprint(item.day) }}</v-card-subtitle>
                    <v-card-text>
                        <div class="text--primary">
                            {{ item.reason }}
                        </div>
                        <v-checkbox
                            v-model="checkbox"
                            :value="item.name"
                        ></v-checkbox>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <v-col><div class="d-flex flex-row mb-6">승인된 목록</div></v-col>
            <v-col class="d-flex flex-row-reverse">
                <v-btn text color="deep-purple accent-4">
                    승인취소
                </v-btn>
            </v-col>
        </v-row>
        <v-row v-for="item_Y in Official_Absence_Yes" :key="item_Y.id">
            <v-col cols="12" md="4" sm="6">
                <v-card>
                    <v-card-title>{{ item_Y.name }}</v-card-title>
                    <v-card-subtitle>{{
                        dayprint(item_Y.day)
                    }}</v-card-subtitle>
                    <v-card-text>
                        <div class="text--primary">
                            {{ item_Y.reason }}
                        </div>
                    </v-card-text>
                </v-card>
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
    computed: {},
    methods: {
        dayprint(day) {
            return moment(day).format('YYYY-MM-DD')
        },
    },
}
</script>
