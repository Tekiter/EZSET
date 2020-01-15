<template>
    <div>
        역할 관리
    </div>
</template>
<script>
export default {
    async created() {
        if (!this.$perm('manageUsers').can('access')) {
            this.$router.push({ name: 'error403' })
            return
        }
    },
}
</script>
