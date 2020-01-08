<template>
    <v-row justify="center">
        <v-col xs="12" sm="10" md="8" lg="8" xl="8">
            <v-tabs centered grow>
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
                                            >mdi-account-circle</v-icon>
                                        </v-avatar>
                                    </div>
                                    <p
                                        class="white--text d-flex justify-center display-1"
                                    >{{user.username}}</p>
                                </v-col>
                            </v-row>
                        </div>
                        <v-list dense>
                            <v-list-item>
                                <v-list-item-content class="d-flex justify-end pr-3">이름 :</v-list-item-content>
                                <v-list-item-content class="align-end">{{userinfo.realname}}</v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content class="d-flex justify-end pr-3">ID :</v-list-item-content>
                                <v-list-item-content class="align-end">{{userinfo.username}}</v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content class="d-flex justify-end pr-3">EMAIL :</v-list-item-content>
                                <v-list-item-content class="align-end">{{userinfo.email}}</v-list-item-content>
                            </v-list-item>
                        </v-list>
                        <v-row>
                            <v-col>
                                <v-btn absolute dark fab battom right color="blue darken-3">
                                    <v-icon>mdi-account-edit-outline</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-tab-item>
                <v-tab>보안설정</v-tab>
                <v-tab-item>
                    <v-card text>
                        <v-card float>
                            <p>456</p>
                        </v-card>
                    </v-card>
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
            isloading: false,
        }
    },
    computed: {
        ...mapState('auth', ['user']),
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