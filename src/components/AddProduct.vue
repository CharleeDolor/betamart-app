<template>
    <NavBar></NavBar>
    <h1>Add Product</h1>
    <form @submit.prevent="addProduct">
        <div class="d-flex flex-column container">

            <div class="form-group mb-2">
                <label for="name">Name</label>
                <input type="text" class="form-control form-control-lg" id="name" v-model="name"
                    placeholder="Enter name">
            </div>

            <div class="form-group mb-2">
                <label for="description">Description</label>
                <textarea class="form-control form-control-lg" v-model="description" id="description"
                    rows="3"></textarea>
            </div>

            <div class="form-group mb-2">
                <label for="price">Description</label>
                <input type="number" class="form-control form-control-lg" step="0.01" v-model="price"
                    placeholder="Price" />
            </div>

            <div class="form-group mb-2">
                <label for="price">Description</label>
                <input type="number" class="form-control form-control-lg" name="stocks" v-model="stocks"
                    placeholder="Stocks">
            </div>

            <div class="d-flex align-items-center justify-content-center">
                <button type="submit" class="m-2 btn btn-success">Save</button>
                <router-link to="/home" class="btn btn-secondary">Cancel</router-link>
            </div>

        </div>

    </form>

</template>

<script>
import axios from '@/lib/axios';
import NavBar from '@/components/NavBar.vue'
export default {
    components: {
        NavBar
    },
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
                for (let i = 0; i < products.length; i++) {
                    if (this.name.toLowerCase() == products[i].name.toLowerCase()) {
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
<style scoped></style>
