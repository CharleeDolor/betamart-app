<template>
  <div>
    <NavBar></NavBar>
    <div class="splitter-container">
      <!-- Background image -->
      <div class="background-image"></div>
      <!-- Content -->
      <div class="container-lg d-flex flex-column wrapper">
        <div class="m-2">
          <router-link to="/add" class="btn btn-primary">Add Product</router-link>
        </div>
        <div v-if="getProducts.length < 1">
          <h3>Seems empty here!</h3>
        </div>
        <div class="d-flex align-items-center justify-content-center flex-column" v-else>
          <h1>Welcome {{ this.getAccountDetails.name }}</h1>
          <h1>My Products</h1>
          <table class="table table-hover table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stocks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in getProducts" :key="product.name">
                <td>{{ product.name }}</td>
                <td>{{ product.description }}</td>
                <td>{{ product.price }}</td>
                <td>{{ product.stocks }}</td>
                <td>
                  <div class="d-flex align-items-center justify-content-center">
                    <button @click="gotoEdit(product.id)" class="m-2 btn btn-warning">Edit</button>
                    <form @submit.prevent="deleteProduct(product)" method="POST">
                      <button type="submit" class="btn btn-danger" @click="confirmDelete">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
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

    async deleteProduct(product) {
      try {
        const response = await axios.delete('/api/products/delete/' + product.id);
        if (response.status == 200) {
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

<style scoped>
.splitter-container {
  display: flex;
  height: 100vh;
}

.background-image {
  flex: 2;
  background-image: url('https://assets.materialup.com/uploads/6102cce0-dc3c-42a3-ba0e-84d25f8a7cd3/preview.gif');
  background-size: cover;
  background-position: center;
}

.wrapper {
  flex: 1;
  padding: 40px 30px 30px 30px;
  background-color: #ecf0f3;
  border-radius: 15px;
  box-shadow: 13px 13px 20px #cbced1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Rest of the existing styles */
</style>
