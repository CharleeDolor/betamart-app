<template>
    <h1>User Registration</h1>
    <form @submit.prevent="registerUser">
        <input type="text" name="name" v-model="name" placeholder="Name" id="">
        <input type="email" name="email" v-model="email" placeholder="Email" id="">
        <input type="password" name="password" v-model="password" placeholder="Password" id="">
        <input type="password" name="password_confirmation" v-model="password_confirmation" placeholder="Confirm Password" id="">
        <input type="submit" value="Register">
    </form>
</template>
<script>
import axios from '@/lib/axios';

export default{
    data(){
        return {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
        }
    },

    methods: {
        async registerUser(){
            try {
                const response = await axios.post('/api/create', {
                    name: this.name,
                    email: this.email,
                    password: this.password,
                    password_confirmation: this.password_confirmation
                });

                if(response.status == 201){
                    // reset fields
                    this.name = '';
                    this.email = '';
                    this.password = '';
                    this.password_confirmation = '';
                    alert('New account created.');
                    this.$router.go(-1);
                }
            } catch (error) {
                console.log(error);
            }
            
        }
    }
}
</script>
<style scoped>
</style>