import Vue from 'vue'

let httpService = new Vue({
    methods: {
        commonPost(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response.data);
            }, (res) => {
                err(response.data);
            });
        }
    }
})



export default httpService;
