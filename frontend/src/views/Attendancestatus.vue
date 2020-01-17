<template>
    <v-container>
        <form>
            <v-row justify="left">
                <v-dialog
                    v-model="absenceResDialog.show"
                    persistent
                    max-width="290"
                >
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark v-on="on">결석예약</v-btn>
                    </template>
                    <v-card>
                        <v-date-picker v-model="dates" multiple></v-date-picker>
                        <v-menu
                            ref="menu"
                            v-model="menu"
                            :close-on-content-click="false"
                            :return-value.sync="dates"
                            transition="scale-transition"
                            offset-y
                            full-width
                            min-width="290px"
                        >
                            <template v-slot:activator="{ on }">
                                <v-combobox
                                    v-model="dates"
                                    multiple
                                    chips
                                    small-chips
                                    label="Multiple picker in menu"
                                    prepend-icon="mdi-plus"
                                    readonly
                                    v-on="on"
                                ></v-combobox>
                            </template>
                            <v-date-picker
                                v-model="dates"
                                multiple
                                no-title
                                scrollable
                            >
                                <v-spacer></v-spacer>
                                <v-btn
                                    text
                                    color="primary"
                                    @click="menu = false"
                                    >Cancel</v-btn
                                >
                                <v-btn
                                    text
                                    color="primary"
                                    @click="$refs.menu.save(dates)"
                                    >OK</v-btn
                                >
                            </v-date-picker>
                        </v-menu>
                        <v-text-field
                            label="결석사유"
                            v-model="absence_reason"
                        ></v-text-field>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="green darken-1"
                                text
                                @click="absenceResDialog.show = false"
                                >취소</v-btn
                            >
                            <v-btn
                                color="green darken-1"
                                text
                                @click="reservation"
                                >확인</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </form>
    </v-container>
</template>
<script>
export default {
    data() {
        return {
            absenceResDialog: {
                show: false,
            },
            dates: [this.$moment(new Date()).format('YYYY-MM-DD')],
            menu: false,
            absence_reason: '',
        }
    },
    methods: {
        reservation() {
            this.absenceResDialog.show = false
        },
    },
}
</script>
