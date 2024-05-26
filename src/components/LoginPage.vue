<template>
  <h1>Login</h1>
  <form @submit.prevent="login">
    <input type="email" name="email" v-model="email" placeholder="Email">
    <input type="password" name="password" v-model="password" placeholder="Password">
    <input type="submit" value="Login">
  </form>
</template>

<script>
import axios from "@/lib/axios";
export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },

  methods: {
    async login() {

      const response = await axios.post('/api/login', {
        email: this.email,
        password: this.password
      });

      if (response.status == 200) {
        localStorage.setItem('token', response.data.token);
        this.email = '';
        this.password = '';
        
        this.$router.push('/home');
      } else {
        alert();
      }
    }
  }
}
</script>