<template>
    <NavBar></NavBar>
    <h1>Welcome {{ this.getAccountDetails.name }}</h1>
    <h1>Products</h1>
    <router-link to="/add">Add Product</router-link>
    <table>
        <thead>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stocks</th>
            <th>Action</th>
        </thead>
        <tbody>
            <tr v-for="product in this.getProducts" :key="product.name">
                <td>{{ product.name }}</td>
                <td>{{ product.description }}</td>
                <td>{{ product.price }}</td>
                <td>{{ product.stocks }}</td>
                <td>
                    <div>
                        <button @click="gotoEdit(product.id)">Edit</button>

                        <form @submit.prevent="deleteProduct(product)" method="POST">
                            <button type="submit"
                                onclick="return confirm('Are you sure you want to delete this post?')">Delete</button>
                        </form>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    <router-view />
</template>

<script>
import axios from '@/lib/axios';
import NavBar from '@/components/NavBar.vue';
export default {
    components: {
        NavBar
    },

    async beforeMount() {
        // load user details
        const accountDetails = await axios.get('/api/user');
        this.$store.dispatch('asyncLoadAccountDetails', accountDetails.data)

        // load products of logged in user
        const products = await axios.get('/api/all', {
            params: {
                user_id: this.$store.getters.getAccountDetails.id
            }
        });
        this.$store.dispatch('asyncLoadProducts', products.data.products);
    },

    computed: {
        getAccountDetails() {
            return this.$store.getters.getAccountDetails;
        },

        getProducts() {
            return this.$store.getters.getProducts;
        }
    },

    methods: {
        gotoEdit(productId) {
            this.$router.push({
                name: 'editProduct',
                params: { id: productId }
            });
        },

        async deleteProduct(product){
            try {
                const response = await axios.delete('/api/products/delete/' + product.id);
                if(response.status == 200){
                    // assign product as payload for deletion in products list
                    let payload = product;
                    this.$store.dispatch('asyncDeleteProduct', payload);
                    
                    alert("Product " + product.name + " is deleted");
                }
            } catch (error) {
                console.log(error)
            }
            

        }
    }
}
</script>