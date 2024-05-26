<template>
    <nav>
        <ul>
            <li>
                <button @click="logout">Logout</button>
            </li>
        </ul>

    </nav>
</template>
<script>
import axios from '@/lib/axios';
export default {
    computed: {
        getAccountDetails(){
            return this.$store.getters.getAccountDetails;
        }
    },
    methods: {
        async logout() {
            try {
                const response = await axios.post('/api/logout', {
                    email: this.getAccountDetails.email
                });
                if (response.status == 200) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('vuex');
                    this.$store.dispatch('asyncLoadAccountDetails', []);
                    this.$router.push('/');
                }
            } catch (error) {
                console.log(error);
            }

        }
    }
}
</script>