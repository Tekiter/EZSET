<template>
    <div>
        <!-- 정보 확인 다이얼로그 -->
        <v-dialog
            :value="alertDialog.show"
            @input="closeAlertDialog()"
            :width="alertDialog.width"
        >
            <v-card>
                <v-card-title>
                    {{ alertDialog.title }}
                </v-card-title>
                <v-card-text>
                    {{ alertDialog.content }}
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="closeAlertDialog()">확인</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- 예 아니오 다이얼로그 -->
        <v-dialog
            :value="confirmDialog.show"
            @input="closeConfirmDialog()"
            :width="confirmDialog.width"
        >
            <v-card>
                <v-card-title>
                    {{ confirmDialog.title }}
                </v-card-title>
                <v-card-text>
                    {{ confirmDialog.content }}
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        color="primary"
                        @click="closeConfirmDialog(true)"
                        >{{ confirmDialog.yesButton }}</v-btn
                    >
                    <v-btn
                        text
                        color="secondary"
                        @click="closeConfirmDialog(false)"
                        >{{ confirmDialog.noButton }}</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapMutations, mapActions } = createNamespacedHelpers('action')

export default {
    components: {},
    data() {
        return {}
    },
    computed: {
        ...mapState(['alertDialog', 'confirmDialog']),
    },
    methods: {
        ...mapMutations([]),
        ...mapActions(['closeAlertDialog', 'closeConfirmDialog']),
    },
}
</script>
