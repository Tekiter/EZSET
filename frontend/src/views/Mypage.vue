<template>
    <v-row justify="center">
        <v-col xs="12" sm="10" md="8" lg="8" xl="8">
            <v-tabs centered vertical>
                <v-tab>회원정보</v-tab>
                <v-tab-item>
                    <v-container fluid class="pa-0">
                        <div class="primary darken-2 text-center">
                            <v-row class="d-flex justify-center">
                                <v-col>
                                    <div class="d-flex justify-center">
                                        <v-avatar
                                            size="100"
                                            :color="
                                                isDarkColor('primary')
                                                    ? 'white'
                                                    : 'black'
                                            "
                                        >
                                            <v-icon
                                                size="110"
                                                color="primary darken-4"
                                                >mdi-account-circle</v-icon
                                            >
                                        </v-avatar>
                                    </div>
                                    <p
                                        class="white--text d-flex justify-center display-1"
                                    >
                                        {{ user.username }}
                                    </p>
                                </v-col>
                            </v-row>
                        </div>
                        <!-- 기본 페이지 (수정 가능 모드 X) -->
                        <v-list dense v-if="!isEditMode">
                            <v-list-item>
                                <v-list-item-content
                                    class="d-flex justify-end pr-3"
                                    >이름 :</v-list-item-content
                                >
                                <v-list-item-content class="align-end">{{
                                    userinfo.realname
                                }}</v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content
                                    class="d-flex justify-end pr-3"
                                    >ID :</v-list-item-content
                                >
                                <v-list-item-content class="align-end">{{
                                    userinfo.username
                                }}</v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content
                                    class="d-flex justify-end pr-3"
                                    >비밀번호 :</v-list-item-content
                                >
                                <v-list-item-content class="align-end"
                                    >******</v-list-item-content
                                >
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content
                                    class="d-flex justify-end pr-3"
                                    >EMAIL :</v-list-item-content
                                >
                                <v-list-item-content class="align-end">{{
                                    userinfo.email
                                }}</v-list-item-content>
                            </v-list-item>
                        </v-list>
                        <v-row v-if="!isEditMode">
                            <v-col>
                                <v-row justify="center">
                                    <!-- 수정 버튼 -->
                                    <v-btn
                                        absolute
                                        dark
                                        fab
                                        battom
                                        right
                                        color="primary darken-3"
                                        @click="hasEditToken"
                                    >
                                        <v-icon
                                            >mdi-account-edit-outline</v-icon
                                        >
                                    </v-btn>
                                    <v-dialog v-model="dialog" max-width="400">
                                        <v-card
                                            v-if="!isTokenValid"
                                            :loading="isloadingToEdit"
                                        >
                                            <v-toolbar dark color="primary">
                                                <v-btn
                                                    icon
                                                    dark
                                                    @click="dialog = false"
                                                >
                                                    <v-icon>mdi-close</v-icon>
                                                </v-btn>
                                                <v-toolbar-title>
                                                    비밀번호 확인
                                                </v-toolbar-title>
                                            </v-toolbar>
                                            <v-text-field
                                                v-model="password"
                                                outlined
                                                :error-messages="
                                                    errors.passwordToEdit
                                                "
                                                :append-icon="
                                                    showpw
                                                        ? 'mdi-eye'
                                                        : 'mdi-eye-off'
                                                "
                                                :type="
                                                    showpw ? 'text' : 'password'
                                                "
                                                label="password"
                                                hint="비밀번호는 8~16자로 영문대 소문자, 숫자, 특수문자를 사용하세요"
                                                @click:append="showpw = !showpw"
                                                class="px-3 pt-3"
                                            ></v-text-field>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn
                                                    color="primary darken-4"
                                                    type="submit"
                                                    text
                                                    large
                                                    @click="editStart"
                                                    >확인</v-btn
                                                >
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                </v-row>
                            </v-col>
                        </v-row>
                        <!-- 수정 가능 모드 -->
                        <v-list dense v-if="isEditMode">
                            <v-snackbar v-model="isSnackbar" :timeout="6000">
                                FINISH 버튼을 누르면 비밀번호 변경이 적용됩니다.
                                <v-btn
                                    color="red"
                                    text
                                    @click="isSnackbar = false"
                                >
                                    Close
                                </v-btn>
                            </v-snackbar>
                            <v-list-item>
                                <v-list-item-content
                                    class="d-flex justify-end pr-3"
                                    >이름 :</v-list-item-content
                                >
                                <v-list-item-content class="align-end">
                                    <v-text-field
                                        v-model="form.realname"
                                        label="Name"
                                        :placeholder="userinfo.realname"
                                        outlined
                                        dense
                                    ></v-text-field>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content
                                    class="d-flex justify-end pr-3"
                                    >ID :</v-list-item-content
                                >
                                <v-list-item-content class="align-end">{{
                                    userinfo.username
                                }}</v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content
                                    class="d-flex justify-end pr-3"
                                    >비밀번호 :</v-list-item-content
                                >
                                <v-list-item-content class="align-end">
                                    <v-btn
                                        text
                                        color="primary darken-3"
                                        @click="changePassword()"
                                    >
                                        change password
                                    </v-btn>
                                    <v-dialog v-model="dialog2" max-width="400">
                                        <v-card>
                                            <v-toolbar dark color="primary">
                                                <v-btn
                                                    icon
                                                    dark
                                                    @click="
                                                        cancelChangePassword()
                                                    "
                                                >
                                                    <v-icon>mdi-close</v-icon>
                                                </v-btn>
                                                <v-toolbar-title>
                                                    비밀번호 변경
                                                </v-toolbar-title>
                                            </v-toolbar>
                                            <v-text-field
                                                v-model="form.password"
                                                @change="checkPassword()"
                                                :error-messages="
                                                    errors.password
                                                "
                                                outlined
                                                :append-icon="
                                                    showpw
                                                        ? 'mdi-eye'
                                                        : 'mdi-eye-off'
                                                "
                                                :type="
                                                    showpw ? 'text' : 'password'
                                                "
                                                label="새비밀번호"
                                                hint="비밀번호는 8~16자로 영문대 소문자, 숫자, 특수문자를 사용하세요"
                                                @click:append="showpw = !showpw"
                                                class="px-3 pt-3"
                                            ></v-text-field>
                                            <v-text-field
                                                v-model="form.confirmpassword"
                                                @change="checkConfirmPassword()"
                                                :error-messages="
                                                    errors.confirmpassword
                                                "
                                                outlined
                                                :append-icon="
                                                    showpw
                                                        ? 'mdi-eye'
                                                        : 'mdi-eye-off'
                                                "
                                                :type="
                                                    showpw ? 'text' : 'password'
                                                "
                                                label="새비밀번호 확인"
                                                @click:append="showpw = !showpw"
                                                class="px-3 pt-3"
                                            ></v-text-field>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn
                                                    color="primary darken-4"
                                                    type="submit"
                                                    text
                                                    large
                                                    @click="
                                                        changePasswordFinish()
                                                    "
                                                    >확인</v-btn
                                                >
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content
                                    class="d-flex justify-end pr-3"
                                    >EMAIL :</v-list-item-content
                                >
                                <v-list-item-content class="align-end">
                                    <v-text-field
                                        v-model="form.email"
                                        label="E-mail"
                                        :placeholder="userinfo.email"
                                        outlined
                                        dense
                                    ></v-text-field>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                        <v-row v-if="isEditMode">
                            <v-col>
                                <v-row justify="center">
                                    <v-btn
                                        :loading="isloadingToFinishEdit"
                                        :disabled="isloadingToFinishEdit"
                                        absolute
                                        battom
                                        right
                                        color="primary"
                                        @click="editFinish"
                                    >
                                        FINISH
                                    </v-btn>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-tab-item>
            </v-tabs>
        </v-col>
    </v-row>
</template>
<script>
//import axios from 'axios'
import { mapState } from 'vuex'
import axios from 'axios'
export default {
    data() {
        return {
            userinfo: {
                username: '',
                realname: '',
                email: '',
            },
            form: {
                password: '',
                confirmpassword: '',
                realname: '',
                email: '',
            },
            errors: {
                passwordToEdit: '',
                password: '',
                confirmpassword: '',
                email: '',
            },
            isloadingToEdit: false,
            isloadingToFinishEdit: false, //로딩하는 코드 추가 필요
            isEditMode: false, //수정 가능 모드
            isTokenValid: false,
            dialog: false,
            dialog2: false,
            isSnackbar: false,
            showpw: false,
            password: '',
        }
    },
    errorRequiredStep() {
        if (this.errors.password != '') {
            return true
        }
        return false
    },
    computed: {
        ...mapState('auth', ['user']),
    },
    methods: {
        async hasEditToken() {
            try {
                let isTokenValid = await this.$store.dispatch(
                    'auth/checkEditToken'
                )
                if (!isTokenValid) {
                    this.dialog = true
                } else {
                    this.isEditMode = true
                }
            } catch (error) {
                // if (error.response.status == 409)
                // // eslint-disable-line no-console
            }
        },
        async editStart() {
            try {
                this.isloadingToEdit = true
                await this.$store.dispatch('auth/issueEditToken', {
                    username: this.userinfo.username,
                    password: this.password,
                })
                this.dialog = false
                this.isEditMode = true
            } catch (error) {
                this.errors.passwordToEdit = '비밀번호가 틀렸습니다'
                //
            } finally {
                this.password = ''
                this.isloadingToEdit = false
            }
        },
        async editFinish() {
            // this.isloading = true 로딩 시스템 필요
            try {
                this.isloadingToFinishEdit = true
                await axios.post('/mypage/edit', {
                    username: this.userinfo.username,
                    password: this.form.password,
                    realname: this.form.realname,
                    email: this.form.email,
                    edittoken: this.$store.state.auth.editToken,
                })
                await this.patchUser()
                //
                this.isloadingToFinishEdit = false
                this.isEditMode = false
            } catch (error) {
                //
            }
        },
        async patchUser() {
            this.isloading = true
            try {
                const res = await axios.get('mypage')
                this.userinfo.username = res.data.username
                this.userinfo.realname = res.data.realname
                this.userinfo.email = res.data.email
            } catch (error) {
                // if (error.response.status == 409)
                // // eslint-disable-line no-console
            } finally {
                this.isloading = false
            }
        },
        async changePassword() {
            this.errors.password = ''
            this.errors.confirmpassword = ''
            this.form.password = ''
            this.form.confirmpassword = ''
            this.dialog2 = true
        },
        async checkPassword() {
            let pwreg = /^(?=.*[A-Za-z]+)(?=.*[0-9]+)(?=.*[`~!@#$%^&*()\-_+=;:"'?.,<>[\]{}/\\|]*).{8,16}$/
            if (!pwreg.test(this.form.password)) {
                this.errors.password =
                    '비밀번호는 8~16자로 영문대 소문자, 숫자, 특수문자를 사용하세요'
            } else this.errors.password = ''
            return
        },
        async checkConfirmPassword() {
            if (this.form.password != this.form.confirmpassword) {
                this.errors.confirmpassword =
                    '비밀번호 확인이 일치하지 않습니다.'
            } else this.errors.confirmpassword = ''
            return
        },
        async cancelChangePassword() {
            this.dialog2 = false
            this.form.password = ''
            this.form.confirmpassword = ''
        },
        async changePasswordFinish() {
            if (
                this.errors.password == '' &&
                this.errors.confirmpassword == '' &&
                this.form.password != ''
            ) {
                //
                this.dialog2 = false
                this.isSnackbar = true
            }
            return
        },
        async checkChangePasswordFinish() {
            if (this.changePasswordFinish()) {
                this.dialog2 = false
            }
        },
    },
    async created() {
        try {
            await this.patchUser()
        } catch (error) {
            //
        }
    },
}
</script>
