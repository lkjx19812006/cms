<template>
    <div>
       adduser
    </div>
</template>
<script>
import {
    mapGetters
} from 'vuex'

export default {
    data() {
        return {
            loading: true
        }
    },
    computed: {
        langConfig() {
            return require('../../i18n/' + this.$route.meta.lang + '.i18n.json')
        }
    },
    methods: {
        checkout(param) {
            console.log(param);
            console.log(this.$store.state.products);
        }
    }
}
</script>
