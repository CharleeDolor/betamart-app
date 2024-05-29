<template>
    <div>
      <NavBar></NavBar>
      <div class="splitter-container">
        <!-- Background image -->
        <div class="background-image"></div>
        <!-- Content -->
        <div class="wrapper">
          <h1>Edit Product</h1>
          <form @submit.prevent="updateProduct">
            <div class="d-flex flex-column container">
              <label for="name">Name</label>
              <div class="form-group mb-2">
                <input type="text" class="form-control form-control-lg" name="name" v-model="name" placeholder="Name" id="name">
              </div>
  
              <div class="form-group mb-2">
                <label for="description">Description</label>
                <textarea class="form-control form-control-lg" name="description" id="description" v-model="description" cols="30" rows="10"></textarea>
              </div>
  
              <div class="form-group mb-2">
                <label for="price">Price</label>
                <input type="number" step="0.01" class="form-control form-control-lg" name="price" v-model="price" placeholder="Price" id="price" />
              </div>
  
              <div class="form-group mb-2">
                <label for="stocks">Stocks</label>
                <input type="number" class="form-control form-control-lg" name="stocks" v-model="stocks" placeholder="Stocks" id="stocks">
              </div>
  
              <div class="d-flex align-items-center justify-content-center">
                <button type="submit" class="btn btn-success m-2">Edit</button>
                <router-link to="/home" class="btn btn-secondary">Cancel</router-link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
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
          let count = 0;
          for (let i = 0; i < this.$store.getters.getProducts.length; i++) {
            if (this.$store.getters.getProducts[i].name.toLowerCase() == payload.name.toLowerCase()) {
              count++;
            }
          }
  
          if (count > 1) {
            throw "Product name already exists";
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
<style scoped>
.splitter-container {
  display: flex;
  height: 100vh;
}

.background-image {
  flex: 2;
  background-image: url('https://cdn.dribbble.com/users/443127/screenshots/11049996/media/65f8cf2ec85940bc6de1b70e80900725.gif');
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

textarea {
  height: 120px; /* Adjust the height as needed */
  resize: none; /* Prevent resizing by user */

}
</style>


