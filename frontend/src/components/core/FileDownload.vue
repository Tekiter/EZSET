<template>
    <div class="d-flex">
        <v-spacer></v-spacer>
        <v-subheader>파일 첨부</v-subheader>
        <v-btn
            v-for="file in files"
            :key="file.id"
            @click="onDownload(file)"
            depressed
            outlined
            color="green"
        >
            {{ file.filename }}
            <v-icon class="ml-1">mdi-file-outline</v-icon>
        </v-btn>
    </div>
</template>

<script>
// import fileDownload from 'js-file-download'
import download from 'downloadjs'
import axios from 'axios'

export default {
    props: {
        files: {
            type: Array,
        },
    },
    methods: {
        async onDownload(file) {
            const res = await axios({
                url: `file/download/${file.id}`,
                method: 'GET',
                responseType: 'blob',
            })
            const blob = new Blob([res.data])
            download(blob, file.filename)
        },
    },
}
</script>
