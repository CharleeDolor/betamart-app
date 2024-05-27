<template>
    <h1>Add Product</h1>
    <form @submit.prevent="addProduct">
        <input type="text" name="name" v-model="name" placeholder="Name">
        <label for="description">Description:</label>
        <textarea name="description" v-model="description" cols="30" id="description" rows="10"></textarea>
        <input type="number" step="0.01" v-model="price" placeholder="Price" />
        <input type="number" name="stocks" v-model="stocks" placeholder="Stocks">
        <button type="submit">Save</button>
        <router-link to="/home">Cancel</router-link>
    </form>
</template>

<script>
import axios from '@/lib/axios';
export default {
    data() {
        return {
            name: '',
            description: '',
            price: 0.00,
            stocks: 0
        }
    },

    methods: {
        async addProduct() {
            try {
                // check if product already exist
                let products = this.$store.getters.getProducts;
                for(let i = 0; i < products.length; i++){
                    if(this.name.toLowerCase() == products[i].name.toLowerCase()){
                        throw "Product already exist";
                    }
                }
                const response = await axios.post('/api/products/store', {
                    name: this.name,
                    description: this.description,
                    stocks: this.stocks,
                    user_id: this.$store.getters.getAccountDetails.id,
                    price: this.price
                });

                if (response.status == 201) {
                    this.$store.dispatch('asyncAddProduct', response.data.product);
                    alert('Product created');
                    
                    this.$router.push('/home');
                }
            } catch (error) {
                alert(error);
            }
        }
    }
}

</script>
<style scoped>
    
</style>
