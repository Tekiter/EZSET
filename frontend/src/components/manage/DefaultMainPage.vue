<template>
    <div>
        <v-tabs v-model="tab">
            <v-tab>보기</v-tab>
            <v-tab v-if="$perm('manageHome').can('update')">수정</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-tab-item><viewer :value="homeview"/></v-tab-item>
            <v-tab-item>
                <v-card outlined>
                    <v-card-text
                        ><editor
                            ref="editor"
                            mode="wysiwyg"
                            :options="editor.options"
                        />
                    </v-card-text>
                    <v-card-action class="d-flex">
                        <v-spacer></v-spacer>
                        <v-btn @click="save">저장</v-btn>
                    </v-card-action>
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
            tab: null,
            editor: {
                options: {
                    language: 'ko',
                },
            },
            homeview: '',
        }
    },
    async created() {
        try {
            const cursor = await axios.get('home/simple')
            this.homeview = cursor.data
        } catch (err) {
            //
        }
    },
    methods: {
        async save() {
            try {
                await axios.patch('home/simple', {
                    content: this.getMarkdown(),
                })
            } catch (err) {
                //
            }
        },
        getMarkdown() {
            return this.$refs.editor.invoke('getMarkdown')
        },
    },
}
</script>
