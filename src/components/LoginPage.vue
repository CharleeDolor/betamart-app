<template>
  <h1>Login</h1>
  <form @submit.prevent="login">
    <input type="email" name="email" v-model="email" id="">
    <input type="password" name="password" v-model="password" id="">
    <input type="submit" value="Login">
  </form>
</template>

<script>
import axios from "@/lib/axios";
export default{
  data(){
    return {
      email: '',
      password: ''
    }
  },

  methods: {
    async login(){
      try {
        const response = await axios.post('/login', {
          email: this.email,
          password: this.password
        });

        console.log(response.data);

      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>