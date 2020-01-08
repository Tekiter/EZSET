<template>
    <v-app>
        <v-app-bar app clipped-left>
            <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" /> -->
            <v-btn text to="/">
                <v-toolbar-title>EZSET</v-toolbar-title>
            </v-btn>회원가입
        </v-app-bar>
        <v-content>
            <v-container>
                <v-row justify="center">
                    <v-col xs="12" sm="10" md="8" lg="6" xl="4">
                        <v-card :loading="isloading">
                            <v-stepper v-model="curpage" vertical>
                                <v-list-item-title
                                    class="headline mt-3 font-weight-bold text-center"
                                >CREATE YOUR ACCOUNT</v-list-item-title>
                                <v-stepper-step
                                    :complete="curpage > 1"
                                    :rules="[() => !errorRequiredStep]"
                                    step="1"
                                >필수정보입력</v-stepper-step>

                                <v-stepper-content step="1">
                                    <v-text-field
                                        v-model="form.realname"
                                        label="name"
                                        @input="removeError('realname')"
                                        :error-messages="errors.realname"
                                        required
                                    ></v-text-field>
                                    <v-text-field
                                        v-model="form.username"
                                        label="ID"
                                        @input="removeError('username')"
                                        @change="checkUsername()"
                                        :error-messages="errors.username"
                                        :success-messages="success.username"
                                        required
                                    ></v-text-field>
                                    <v-text-field
                                        v-model="form.password"
                                        label="password"
                                        @input="removeError('password')"
                                        @change="checkPassword()"
                                        :error-messages="errors.password"
                                        type="password"
                                        required
                                    ></v-text-field>
                                    <v-text-field
                                        v-model="form.confirmpassword"
                                        label="confirm password"
                                        @input="removeError('confirmpassword')"
                                        @change="checkConfirmPassword()"
                                        :error-messages="errors.confirmpassword"
                                        type="password"
                                        required
                                    ></v-text-field>
                                </v-stepper-content>

                                <v-stepper-step :complete="curpage > 2" step="2">추가정보입력</v-stepper-step>

                                <v-stepper-content step="2">
                                    <v-text-field v-model="form.email" label="E-mail" required></v-text-field>
                                </v-stepper-content>

                                <v-row>
                                    <v-col class="d-flex flex-row justify-center">
                                        <v-btn
                                            class="mr-3"
                                            color="primary"
                                            @click="curpage -= 1"
                                            v-if="curpage != 1"
                                        >이전</v-btn>
                                        <v-btn
                                            color="primary"
                                            @click="curpage += 1"
                                            v-if="curpage != maxpage"
                                        >다음</v-btn>
                                        <v-btn
                                            color="primary"
                                            @click="finish"
                                            :disabled="errorRequiredStep"
                                            v-if="curpage == maxpage"
                                        >완료</v-btn>
                                    </v-col>
                                </v-row>
                            </v-stepper>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-content>
    </v-app>
</template>
<script>
import axios from 'axios'

export default {
    data() {
        return {
            form: {
                username: '',
                password: '',
                confirmpassword: '',
                realname: '',
                email: '',
            },
            errors: {
                username: '',
                realname: '',
                password: '',
                confirmpassword: '',
                email: '',
            },
            success: {
                username: '',
            },
            curpage: 1,
            isloading: false,
        }
    },
    computed: {
        maxpage() {
            return 2
        },
        errorRequiredStep() {
            if (
                this.errors.username != '' ||
                this.errors.realname != '' ||
                this.errors.password != '' ||
                this.errors.confirmpassword != ''
            ) {
                return true
            }
            return false
        },
    },
    methods: {
        async finish() {
            this.clearErrors()
            if (!this.checkValid()) {
                return
            }
            this.isloading = true
            try {
                const res = await axios.post('auth/register', {
                    username: this.form.username,
                    password: this.form.password,
                    realname: this.form.realname,
                    email: this.form.email,
                })
                this.$router.push({ path: '/' })
                console.log(res) // eslint-disable-line no-console
            } catch (error) {
                // if (error.response.status == 409)
                console.log(error.response) // eslint-disable-line no-console
            } finally {
                this.isloading = false
            }
        },
        checkValid() {
            let result = true
            if (this.form.username == '') {
                this.errors.username = '아이디를 입력해주세요'
                result = false
            }
            if (this.form.realname == '') {
                this.errors.realname = '이름을 입력해주세요'
                result = false
            }
            if (this.form.password == '') {
                this.errors.password = '비밀번호를 입력해주세요'
                result = false
            }
            if (this.form.confirmpassword == '') {
                this.errors.confirmpassword = '비밀번호를 입력해주세요'
                result = false
            }
            return result
        },
        clearErrors() {
            const keys = Object.keys(this.errors)
            keys.forEach(i => {
                this.errors[i] = ''
            })
        },
        removeError(field) {
            this.errors[field] = ''
        },
        async checkUsername() {
            let idreg = /^[a-z0-9]{6,12}$/
            if (!idreg.test(this.form.username)) {
                this.errors.username =
                    '아이디는 6~12자의 영문 소문자, 숫자만 사용 가능합니다.'
                return
            }

            try {
                const res = await axios.post(
                    'auth/register/doublecheck/username',
                    {
                        username: this.form.username,
                    }
                )
                this.success.username = '사용할 수 있는 아이디입니다.'
                console.log(res)
            } catch (error) {
                this.errors.username = '중복된 아이디입니다.'
                console.log(error)
            }
        },
        async checkPassword() {
            let pwreg = /^(?=.*[A-Za-z]+)(?=.*[0-9]+)(?=.*[`~!@#$%^&*()\-_+=;:"'?.,<>[\]{}/\\|]*).{8,16}$/
            if (!pwreg.test(this.form.password)) {
                this.errors.password =
                    '비밀번호는 8~16자로 영문대 소문자, 숫자, 특수문자를 사용하세요'
                return
            }
        },
        async checkConfirmPassword() {
            if (this.form.password != this.form.confirmpassword) {
                this.errors.confirmpassword =
                    '비밀번호 확인이 일치하지 않습니다.'
                return
            }
        },
    },
}
</script>
