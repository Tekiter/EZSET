<template>
    <div>
        <v-card>
            <v-card-title>
                <span class="headline">{{ realname }}</span>
                <v-card-subtitle>{{ username }}</v-card-subtitle>
            </v-card-title>
            <v-card-text>
                <v-divider></v-divider>
                <v-list v-if="attendanceInfo.length > 0">
                    <v-list-item
                        v-for="recode in attendanceInfo"
                        :key="recode.date"
                    >
                        <template>
                            <v-list-item-content>
                                <v-list-item-title>
                                    <div class="d-flex">
                                        <div
                                            class="d-flex flex-wrap flex-grow-1"
                                        >
                                            <v-btn text>
                                                {{ recode.date }}
                                            </v-btn>
                                        </div>
                                        <v-spacer></v-spacer>
                                        <div class="d-flex pl-3">
                                            <v-tooltip bottom>
                                                <template
                                                    v-slot:activator="{
                                                        on,
                                                    }"
                                                >
                                                    <v-icon
                                                        v-on="on"
                                                        v-if="
                                                            recode.state ==
                                                                'attendance'
                                                        "
                                                        color="success"
                                                        >mdi-checkbox-blank-circle-outline</v-icon
                                                    >
                                                </template>
                                                <span>출석</span>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template
                                                    v-slot:activator="{
                                                        on,
                                                    }"
                                                >
                                                    <v-icon
                                                        v-on="on"
                                                        v-if="
                                                            recode.state ==
                                                                'late'
                                                        "
                                                        color="warning"
                                                        >mdi-triangle-outline</v-icon
                                                    >
                                                </template>
                                                <span>지각</span>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template
                                                    v-slot:activator="{
                                                        on,
                                                    }"
                                                >
                                                    <v-icon
                                                        v-on="on"
                                                        v-if="
                                                            recode.state ==
                                                                'absence'
                                                        "
                                                        color="error"
                                                        >mdi-close</v-icon
                                                    >
                                                </template>
                                                <span>결석</span>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template
                                                    v-slot:activator="{
                                                        on,
                                                    }"
                                                >
                                                    <v-icon
                                                        v-on="on"
                                                        v-if="
                                                            recode.state ==
                                                                'official_absence'
                                                        "
                                                        color="success"
                                                        >mdi-close-circle-outline</v-icon
                                                    >
                                                </template>
                                                <span>공결</span>
                                            </v-tooltip>
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
                                                                recode.date
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
            <v-card-text v-if="attendanceInfo.length == 0">
                정보가 없습니다.
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="closeattendanceUserDialog()" text>닫기</v-btn>
            </v-card-actions>
        </v-card>
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
    </div>
</template>
<script>
import { AttendanceService } from '../../service/attendance.service'
import moment from 'moment'

export default {
    name: 'AttendanceManageMonthDialog',
    props: ['username', 'realname', 'Sdate', 'Edate', 'attendanceInfo'],
    data() {
        return {
            fetchingCount: 0,
            totalCount: 0,

            itemsPerPage: 9,
            page: 1,

            toolbar: {
                search: '',
            },
            attendance: {
                info: [],
            },
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
        }
    },
    async created() {
        if (!this.$perm('attendance').can('update')) {
            this.$router.push({ name: 'error403' })
            return
        }
        await this.fetchAll()
    },
    computed: {
        isFetching() {
            return this.fetchingCount > 0
        },
    },
    watch: {
        attendanceInfo() {
            if (this.attendanceInfo.length > 0) {
                this.attendanceInfo.forEach(element => {
                    element.date = moment(element.date).format('YYYY-MM-DD')
                })
            }
        },
    },
    methods: {
        async fetchAll() {
            this.attendance.info = await AttendanceService.getAttendanceByUsernameAndDateBetweenStartDateAndEndDate(
                this.username,
                this.Sdate,
                this.Edate
            )
            if (this.attendanceInfo.length > 0) {
                this.attendanceInfo.forEach(element => {
                    element.date = moment(element.date).format('YYYY-MM-DD')
                })
            }
        },
        async deleteItem() {
            await AttendanceService.deleteAttendanceByUsernameAndDate(
                this.username,
                this.deleteDialog.date
            )
            this.openSnackbar('삭제되었습니다', 'success')
            this.$emit('fetchDialog', false)
            this.deleteDialog.show = false
        },
        async closeattendanceUserDialog() {
            this.$emit('closeDialog', false)
            await this.fetchAll()
        },
        openDeleteItem(record) {
            this.deleteDialog.show = true
            this.deleteDialog.date = record
        },
        openSnackbar(text, color) {
            this.snackbar.text = text
            this.snackbar.color = color
            this.snackbar.show = true
        },
    },
}
</script>
