<template>
    <v-container>
        <group-tree :items="groups"></group-tree>
    </v-container>
</template>

<script>
import axios from 'axios'
import GroupTree from '../components/filebox/GroupTree.vue'

export default {
    components: {
        GroupTree,
    },
    data() {
        return {
            fileboxes: [],
            groups: [],
        }
    },
    async created() {
        const res = await axios.get('/filebox')
        console.log(res)
        this.groups = res.data.groups
    },
}
</script>
