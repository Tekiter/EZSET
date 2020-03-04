<template>
    <div v-if="files.length > 0">
        <div class="d-flex justify-center justify-sm-end" v-if="!hideLabel">
            <v-subheader>첨부</v-subheader>
        </div>
        <div class="d-flex flex-wrap flex-sm-row-reverse flex-column">
            <v-btn
                v-for="file in files"
                :key="file.id"
                @click="onDownload(file)"
                depressed
                outlined
                color="green"
                class="mr-2 mb-1"
            >
                {{ file.filename }}
                <v-icon class="ml-1">{{ iconConvert(file.filename) }}</v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script>
import download from 'downloadjs'
import axios from 'axios'

const icons = {
    default: 'mdi-file-outline',
    picture: 'mdi-file-image-outline',
    document: 'mdi-file-document-outline',
    pdf: 'mdi-file-pdf-outline',
    music: 'mdi-file-music-outline',
    ppt: 'mdi-file-powerpoint-outline',
    spreadsheet: 'mdi-file-table-outline',
}

const iconExtMap = {
    picture: ['png', 'jpg', 'jpeg', 'gif'],
    document: ['doc', 'docx', 'txt'],
    pdf: ['pdf'],
    music: ['mp3', 'wav'],
    ppt: ['ppt'],
    spreadsheet: ['xls', 'xlsx'],
}

const extIconMap = {}

// 확장자-아이콘 쌍의 Object로 변환
Object.keys(iconExtMap).forEach(iconName => {
    iconExtMap[iconName].forEach(ext => {
        extIconMap[ext] = icons[iconName]
    })
})

export default {
    props: {
        files: {
            type: Array,
            default() {
                return []
            },
        },
        hideLabel: {
            type: Boolean,
            default: false,
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
        iconConvert(filename) {
            const ext = filename
                .toLowerCase()
                .split('.')
                .reverse()[0]

            const icon = extIconMap[ext]
            if (icon) {
                return icon
            } else {
                return icons.default
            }
        },
    },
}
</script>
