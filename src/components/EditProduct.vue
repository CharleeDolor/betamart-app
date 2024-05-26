<template>
    <h1>Edit Product</h1>
    <form @submit.prevent="updateProduct">
        <input type="text" name="name" v-model="name" placeholder="Name" id="">
        <label for="description">Description:</label>
        <textarea name="description" id="description" v-model="description" cols="30" rows="10"></textarea>
        <input type="number" step="0.01" name="price" v-model="price" placeholder="Price" />
        <input type="number" name="stocks" v-model="stocks" placeholder="Stocks">
        <button type="submit">Edit</button>
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

    async beforeMount() {
        try {
            const response = await axios.get('/api/show/' + this.$route.params.id);
            let data = response.data.product;
            if (response.status == 200) {
                this.name = data.name;
                this.description = data.description;
                this.price = data.price,
                    this.stocks = data.stocks
            }
        } catch (error) {
            console.log(error);
        }
    },

    methods: {
        back() {
            this.$router.go(-1);
        },

        async updateProduct() {
            try {
                // get fields and make payload to update products list
                let payload = {
                    name: this.name,
                    description: this.description,
                    price: this.price,
                    stocks: this.stocks,
                    id: this.$route.params.id
                }

                // check if product name already exists
                for (let i = 0; i < this.$store.getters.getProducts.length; i++) {
                    if (this.$store.getters.getProducts[i].name.toLowerCase() == payload.name.toLowerCase()) {
                        throw "Product name already exists";
                        
                    }
                }

                const response = await axios.put('/api/products/update/' + this.$route.params.id, {
                    name: this.name,
                    description: this.description,
                    price: this.price,
                    stocks: this.stocks
                });

                if (response.status == 200) {
                    // use payload to update list
                    this.$store.dispatch('asyncUpdateProduct', payload);

                    // return to default
                    this.name = '';
                    this.description = '';
                    this.price = 0.00;
                    this.stocks = 0;
                    alert('Product updated');
                    this.$router.go(-1);
                }
            } catch (error) {
                alert(error);
            }
        }
    }
}

</script>
