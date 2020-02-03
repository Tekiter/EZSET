<template>
    <div></div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            fileboxes: [],
        }
    },
    name: 'home',
    components: {},
    mounted() {
        axios.get('/filebox').then(res => {
            this.fileboxes = res.data
            this.loading = false
        })
    },
}
</script>
