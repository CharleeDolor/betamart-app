<template>
  <div>
    <NavBar></NavBar>
    <div class="container-lg d-flex flex-column">
      <br>
      <div class="m-2">
        <router-link to="/add" class="btn btn-primary">Add Product</router-link>
      </div>
      <h1>Welcome {{ getAccountDetails.name }}</h1>

      <div v-if="getProducts.length < 1">
        <h3>Seems empty here!</h3>
      </div>
      <div class="d-flex align-items-center justify-content-center flex-column" v-else>
        <h1>My Products</h1>

        <div class="product-list">
          <div v-for="product in getProducts" :key="product.id" class="product-item">
            <img :src="require('@/assets/shoespng.png')" alt="Product Image" class="product-image">
            <div class="product-details">
              <h2>{{ product.name }}</h2>
              <p>Price: {{ product.price }}</p>
              <p>Stocks: {{ product.stocks }}</p>
              <div class="product-actions">
                <button @click="gotoEdit(product.id)" class="btn btn-warning">Edit</button>
                <button @click="deleteProduct(product)" class="btn btn-danger"
                  onclick="return confirm('Are you sure you want to delete this product?')">Delete</button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

    <router-view />
  </div>
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
    this.$store.dispatch('asyncLoadAccountDetails', accountDetails.data);

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

    async deleteProduct(product) {
      try {
        const response = await axios.delete('/api/products/delete/' + product.id);
        if (response.status === 200) {
          // Add fade-out animation to the product item
          product.deleted = true;

          // assign product as payload for deletion in products list
          const payload = product;
          this.$store.dispatch('asyncDeleteProduct', payload);

          setTimeout(() => {
            alert("Product " + product.name + " is deleted");
          }, 500); // Delay alert to allow time for animation
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style scoped>
.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.product-item {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  position: relative;
}

.product-image {
  width: 100%;
  height: auto;
  max-height: 150px;
  object-fit: cover;
  border-bottom: 1px solid #ccc;
  padding-bottom: 1rem;
}

.product-details {
  text-align: center;
}

.product-actions {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 1rem;
}

.fade-out {
  animation: fadeOut 0.5s ease forwards;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
