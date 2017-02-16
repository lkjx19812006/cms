<template>
    <div class="cart">
        <h2>{{langConfig.cartTitle}}</h2>
        <p v-show="!products.length"><i>{{langConfig.addCart}}</i></p>
        <ul>
            <li v-for="p in products">
                {{ p.title }} - {{ p.price }} x {{ p.quantity }}
            </li>
        </ul>
        <!--   <p>Total: {{ total | currency }}</p> -->
        <p>
            <button @click="checkout(products)">{{langConfig.checkOut}}</button>
        </p>
        <p>{{langConfig.checkOut}}sddsfsdf</p>
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
import {
    mapGetters
} from 'vuex'

let _self = this;

function fetchItem(store) {
    return store.dispatch('TEST',
        store.products
    );
}

export default {
    name: 'home-view',
    data() {
        return {
            loading: true
        }
    },
    computed: {
        products() {
            return this.$store.state.products.all
        },
        langConfig(){
            return require('../../i18n/' + this.$route.meta.lang + '.i18n.json') 
        }
    },
    methods: {
        checkout(param) {
            console.log(param);
            console.log(this.$store.state.products);
            console.log(this.$route);
            // this.$router.push('/' + this.$route.meta.lang + '/test')
            this.$router.push('/zh')

        }
    },
    preFetch: fetchItem
}
</script>
