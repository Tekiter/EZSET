<template>
    <div>
        <v-tabs v-model="tab" v-if="$perm('manageHome').can('update')">
            <v-tab>보기</v-tab>
            <v-tab>수정</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-tab-item>
                <v-fade-transition>
                    <v-container fluid v-show="!homeloading">
                        <viewer :value="homeview" />
                    </v-container>
                </v-fade-transition>
            </v-tab-item>
            <v-tab-item v-if="$perm('manageHome').can('update')">
                <v-card outlined>
                    <v-card-text
                        ><editor
                            :value="homeview"
                            ref="editor"
                            mode="wysiwyg"
                            :options="editor.options"
                        />
                        <div class="d-flex mt-3">
                            <v-spacer></v-spacer>
                            <v-btn @click="save" outlined color="primary">
                                저장
                            </v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>
<script>
import { Editor } from '@toast-ui/vue-editor'
import { Viewer } from '@toast-ui/vue-editor'
import axios from 'axios'

export default {
    components: {
        Viewer,
        Editor,
    },
    data() {
        return {
            tab: 0,
            editor: {
                options: {
                    language: 'ko',
                },
            },
            homeview: '',
            homeloading: false,
        }
    },
    async created() {
        this.loadhome()
    },
    methods: {
        async save() {
            try {
                await axios.patch('home/simple', {
                    content: this.getMarkdown(),
                })
                this.loadhome()
                this.tab = 0
            } catch (err) {
                //
            }
        },
        getMarkdown() {
            return this.$refs.editor.invoke('getMarkdown')
        },
        async loadhome() {
            this.homeloading = true
            try {
                const cursor = await axios.get('home/simple')
                this.homeview = cursor.data.content
            } catch (err) {
                //
            }
            this.homeloading = false
        },
    },
}
</script>
