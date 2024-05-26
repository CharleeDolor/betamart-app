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
    methods: {
        async logout() {
            try {
                const response = await axios.post('/api/logout', {
                    email: "dolorcharlee55@gmail.com"
                });
                if (response.status == 200) {
                    localStorage.removeItem('token')
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