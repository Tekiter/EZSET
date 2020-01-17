<template>
    <v-row justify="center">
        <v-col xs="12" sm="10" md="8" lg="8" xl="8">
            <v-tabs centered vertical>
                <v-tab>회원정보</v-tab>
                <v-tab-item>
                    <v-container fluid class="pa-0">
                        <div class="light-blue darken-2 text-center">
                            <v-row class="d-flex justify-center">
                                <v-col>
                                    <div class="d-flex justify-center">
                                        <v-avatar size="100" color="white">
                                            <v-icon
                                                size="110"
                                                color="light-blue darken-4"
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
                                        color="blue darken-3"
                                        @click="hasEditToken"
                                    >
                                        <v-icon
                                            >mdi-account-edit-outline</v-icon
                                        >
                                    </v-btn>
                                    <v-dialog v-model="dialog" max-width="400">
                                        <v-card v-if="!isTokenValid">
                                            <v-toolbar dark color="primary">
                                                <v-btn
                                                    icon
                                                    dark
                                                    @click="dialog = false"
                                                >
                                                    <v-icon>mdi-close</v-icon>
                                                </v-btn>
                                                <v-toolbar-title
                                                    >비밀번호
                                                    확인</v-toolbar-title
                                                >
                                            </v-toolbar>
                                            <v-text-field
                                                v-model="password"
                                                outlined
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
                                                    color="blue darken-4"
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
                            <v-list-item>
                                <v-list-item-content
                                    class="d-flex justify-end pr-3"
                                    >이름 :</v-list-item-content
                                >
                                <v-list-item-content class="align-end">
                                    <v-text-field
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
                                    <v-btn text color="blue darken-3">
                                        change password
                                    </v-btn>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content
                                    class="d-flex justify-end pr-3"
                                    >EMAIL :</v-list-item-content
                                >
                                <v-list-item-content class="align-end">
                                    <v-text-field
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
                                        absolute
                                        dark
                                        battom
                                        right
                                        color="blue darken-3"
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
            // form: {
            //     username: userinfo.username,
            //     password: '',
            //     confirmpassword: '',
            //     realname: userinfo.realname,
            //     email: userinfo.email,
            // },
            isloading: false, //로딩하는 코드 추가 필요
            isEditMode: false, //수정 가능 모드
            isTokenValid: false,
            dialog: false,
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
                console.log(error.response) // eslint-disable-line no-console
            }
        },
        async editStart() {
            try {
                this.dialog = false
                await this.$store.dispatch('auth/issueEditToken', {
                    username: this.userinfo.username,
                    password: this.password,
                })
                this.isEditMode = true
            } catch (error) {
                console.log(error.response)
            }
        },
        // async EditFinish() {
        //     this.clearErrors()
        //     if (!this.checkValid()) {
        //         return
        //     }
        //     this.isloading = true
        //     try {
        //         const res = await axios.post('auth/register', {
        //             username: this.form.username,
        //             password: this.form.password,
        //             realname: this.form.realname,
        //             email: this.form.email,
        //         })
        //         this.$router.push({ path: '/' })
        //         console.log(res) // eslint-disable-line no-console
        //     } catch (error) {
        //         // if (error.response.status == 409)
        //         console.log(error.response) // eslint-disable-line no-console
        //     } finally {
        //         this.isloading = false
        //     }
        // },
    },
    async created() {
        this.isloading = true
        try {
            const res = await axios.get('mypage')
            this.userinfo.username = res.data.username
            this.userinfo.realname = res.data.realname
            this.userinfo.email = res.data.email
        } catch (error) {
            // if (error.response.status == 409)
            console.log(error.response) // eslint-disable-line no-console
        } finally {
            this.isloading = false
        }
    },
}
</script>
