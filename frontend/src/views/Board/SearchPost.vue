<template>
    <div>
        <div>
            <v-text-field
                v-if="loading"
                color="blue darken-2"
                loading
                disabled
            ></v-text-field>
        </div>
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
                            :hint="`${select.state}, ${select.value}`"
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
                            color="blue darken-2"
                            label="Search"
                            counter
                            maxlength="100"
                            append-icon="mdi-magnify"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="2" sm="1">
                        <div class="my-2">
                            <v-btn
                                depressed
                                color="primary"
                                @click="clickSearch()"
                                >검색</v-btn
                            >
                        </div>
                    </v-col>
                </v-row>
            </div>
            <v-card outlined v-if="showData">
                <v-data-table
                    :headers="headers"
                    :items="posts"
                    :page.sync="page"
                    :items-per-page="8"
                    hide-default-footer
                    mobile-breakpoint="0"
                    class="hidden-sm-and-down"
                    @page-count="pageCount = $event"
                >
                    <template v-slot:item.title="props">
                        <a @click="read(props.item)">
                            {{ props.item.title }}
                        </a>
                    </template>
                </v-data-table>
                <v-data-table
                    :headers="headersTwo"
                    :items="posts"
                    :page.sync="page"
                    :items-per-page="8"
                    hide-default-footer
                    mobile-breakpoint="0"
                    class="hidden-md-and-up"
                    @page-count="pageCount = $event"
                >
                    <template v-slot:item.title="props">
                        <a @click="read(props.item)">
                            {{ props.item.title }}
                        </a>
                    </template>
                </v-data-table>
            </v-card>
        </v-container>
    </div>
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
            itemsPerPage: 10,
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
        }
    },
    methods: {
        clickSearch() {
            console.log(this.Selecter)
            this.getData()
            this.showData = true
        },
        async getData() {
            const res = await axios.get('/simple/searchpost', {
                params: {
                    option: this.select.value,
                    content: this.searchObject,
                },
            })
            this.posts = res.data.posts.map(post => {
                post.created_date = moment(post.created_date).format(
                    'YYYY/MM/DD HH:MM'
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
            this.loading = false
        },
    },
}
</script>
