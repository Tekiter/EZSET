<template>
    <v-container grid-list-md>
        <div>
            <v-toolbar-title class="d-flex justify-center"
                ><h1>
                    <strong>게시글 검색</strong>
                </h1></v-toolbar-title
            >
        </div>
        <div>
            <v-row class="d-flex justify-center">
                <v-col cols="5" sm="2">
                    <v-select
                        v-model="select"
                        :items="item"
                        item-text="state"
                        item-value="value"
                        outlined
                        persistent-hint
                        return-object
                    ></v-select>
                </v-col>
                <v-col cols="5" sm="5">
                    <v-text-field
                        v-model="searchObject"
                        color="primary darken-2"
                        label="Search"
                        prepend-inner-icon="mdi-magnify"
                        counter
                        outlined
                        solo
                        flat
                        @change="clickSearch()"
                        :rules="[rules.min]"
                    ></v-text-field>
                </v-col>
                <v-col cols="2" sm="1" v-if="$vuetify.breakpoint.mdAndUp">
                    <div class="my-2">
                        <v-btn
                            large
                            depressed
                            color="primary"
                            :dark="isDarkColor('primary')"
                            @click="clickSearch()"
                            >검색</v-btn
                        >
                    </div>
                </v-col>
                <v-col cols="2" sm="1" v-else>
                    <div class="my-2">
                        <v-btn
                            icon
                            large
                            color="primary"
                            :dark="isDarkColor('primary')"
                            @click="clickSearch()"
                            ><v-icon>mdi-magnify</v-icon></v-btn
                        >
                    </div>
                </v-col>
            </v-row>
        </div>
        <v-card outlined v-if="showData">
            <v-data-table
                v-if="$vuetify.breakpoint.mdAndUp"
                :headers="headers"
                :items="posts"
                :page.sync="page"
                :loading="loading"
                :server-items-length="totalpage"
                :options.sync="options"
                @update:items-per-page="fetchPostList()"
                :items-per-page.sync="itemsPerPage"
                hide-default-footer
                :mobile-breakpoint="NaN"
                @page-count="pageCount = $event"
            >
                <template v-slot:item.title="props">
                    <a @click="read(props.item)">
                        {{ props.item.title }} [{{ props.item.comment_count }}]
                    </a>
                </template>
            </v-data-table>
            <v-list v-else>
                <v-list-item v-for="post in posts" :key="post._id">
                    <v-list-item-content>
                        <v-list-item-title
                            ><a @click="read(post)" class="title"
                                >{{ post.title }} [{{ post.comment_count }}]</a
                            >
                            <v-spacer></v-spacer>
                            <v-icon x-small color="red darken-3"
                                >mdi-heart-multiple</v-icon
                            >
                            {{ post.like }}
                        </v-list-item-title>
                        {{ post.author
                        }}<v-divider class="mx-4" vertical></v-divider>
                        {{ post.created_date
                        }}<v-divider class="mx-4" vertical></v-divider> 조회
                        {{ post.view }}
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <v-row>
                <v-col>
                    <v-pagination
                        v-model="page"
                        :length="pageCount"
                        :items-per-page.sync="page"
                    ></v-pagination>
                </v-col>
            </v-row>
        </v-card>
        <!-- <v-card outlined v-if="showData">
            <v-data-table
                :headers="$vuetify.breakpoint.mdAndUp ? headers : headersTwo"
                :items="posts"
                :page.sync="page"
                :items-per-page="8"
                hide-default-footer
                :mobile-breakpoint="NaN"
                :loading="loading"
                @page-count="pageCount = $event"
            >
                <template v-slot:no-data>
                    <p class="mt-3">검색된 내용이 없습니다.</p>
                </template>
                <template v-slot:loading>
                    <p class="mt-3">검색중..</p>
                </template>
                <template v-slot:item.title="props">
                    <a @click="read(props.item)">
                        {{ props.item.title }}
                    </a>
                </template>
            </v-data-table>
        </v-card> -->
    </v-container>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
    data() {
        return {
            loading: false,
            page: 1,
            pageCount: 0,
            totalpage: 0,
            itemsPerPage: 8,
            options: {},
            select: { state: '제목', value: 'title' },
            item: [
                { state: '제목', value: 'title' },
                { state: '내용', value: 'content' },
                { state: '제목 + 내용', value: 'title+content' },
            ],
            searchObject: '',
            showData: false,
            posts: [],
            headers: [
                {
                    text: '  번호',
                    align: 'left',
                    sortable: false,
                    value: 'number',
                },
                {
                    text: '제목',
                    value: 'title',
                    sortable: false,
                    width: '50%',
                },
                { text: '작성자', value: 'author', sortable: false },
                { text: '작성일', value: 'created_date', width: '20%' },
                { text: '추천', value: 'like' },
                { text: '조회', value: 'view' },
            ],
            headersTwo: [
                {
                    text: '  번호',
                    align: 'left',
                    sortable: false,
                    value: 'number',
                },
                {
                    text: '제목',
                    value: 'title',
                    sortable: false,
                    width: '50%',
                },
                { text: '작성자', value: 'author', sortable: false },
                { text: '추천', value: 'like' },
                { text: '조회', value: 'view' },
            ],
            rules: {
                min: v => v.length >= 2 || '최소 2글자 이상 입력하세요.',
            },
        }
    },
    watch: {
        page: {
            async handler() {
                await this.getData()
            },
        },
        async $route(to, from) {
            await this.getData()
            this.page = 1
        },
    },
    methods: {
        read(evt) {
            this.$router.push({
                path: '/board/' + evt.board + '/' + evt._id,
            })
        },
        clickSearch() {
            if (this.searchObject.length < 2) {
                return
            }
            this.getData()
            this.showData = true
        },
        async getData() {
            this.loading = true
            const res = await axios.get('/simple/searchpost', {
                params: {
                    option: this.select.value,
                    content: this.searchObject,
                    page: this.page,
                    pagesize: this.itemsPerPage,
                },
            })
            this.posts = res.data.posts.map(post => {
                post.created_date = moment(post.created_date).format(
                    'YYYY/MM/DD HH:mm'
                )
                return post
            })
            this.posts = res.data.posts.map(post => {
                post.number = post._id
                return post
            })
            this.posts = res.data.posts.map(post => {
                if (post.isAnonymous == true) {
                    post.author = '익명'
                }
                return post
            })
            this.totalpage = res.data.totalpage
            this.pageCount = Math.ceil(res.data.totalpage / this.itemsPerPage)
            this.loading = false
        },
    },
}
</script>
