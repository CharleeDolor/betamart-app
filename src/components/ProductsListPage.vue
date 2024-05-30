<template>
  <div>
    <NavBar></NavBar>
    <div class="container-lg d-flex flex-column my-4">
      <div class="m-2">
        <router-link to="/add" class="btn btn-primary"><i class="fa-solid fa-cart-plus"></i> Add Product</router-link>
      </div>
      <h1 class="text-center">Welcome, {{ getAccountDetails.name }}</h1>

      <div v-if="getProducts.length < 1" class="text-center mt-5">
        <h3>Seems empty here!</h3>
      </div>
      <div v-else class="d-flex flex-column align-items-center">
        <h1>My Products</h1>
        <div class="product-list">
          <div v-for="product in getProducts" :key="product.id" class="product-item">
            <img :src="require('@/assets/logo-ecommerce.png')" alt="Product Image" class="product-image">
            <div class="product-details">
              <h2>{{ product.name }}</h2>
              <p>Price: {{ product.price }}</p>
              <p>Stocks: {{ product.stocks }}</p>
              <div class="product-actions">
                <button @click="gotoEdit(product.id)" class="btn-edit"><i class="fa-regular fa-pen-to-square"></i></button>
                <button @click="confirmDelete(product)" class="btn-del"><i class="fa-solid fa-trash"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDeleteDialog" class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
      <div class="modal-dialog modal-dialog-centered" role="document" style="max-width: 300px;"> <!-- Adjusted modal size -->
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this product?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-cancel btn-secondary" @click="showDeleteDialog = false">Cancel</button>
            <button type="button" class="btn-delete btn-danger" @click="deleteProduct(productToDelete)">Delete</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showDeleteDialog" class="modal-backdrop fade show"></div>

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

  data() {
    return {
      showDeleteDialog: false,
      productToDelete: null
    };
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

    confirmDelete(product) {
      this.productToDelete = product;
      this.showDeleteDialog = true;
    },

    async deleteProduct(product) {
      try {
        const response = await axios.delete('/api/products/delete/' + product.id);
        if (response.status == 200) {
          // Add fade-out animation to the product item
          product.deleted = true;

          // assign product as payload for deletion in products list
          this.$store.dispatch('asyncDeleteProduct', product);

          setTimeout(() => {
            alert("Product " + product.name + " is deleted");
          }, 500); // Delay alert to allow time for animation

          this.showDeleteDialog = false;
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
  overflow: hidden; /* Ensure the image doesn't overflow the container */
}

.product-image {
  width: 100%;
  height: auto;
  max-height: 150px;
  object-fit: cover;
  border-bottom: 1px solid #ccc;
  padding-bottom: 1rem;
  transition: transform 0.3s ease-in-out; /* Smooth transition for zoom effect */
}

.product-item:hover .product-image {
  transform: scale(1.1); /* Zoom in effect */
}
.btn-edit {
  padding: 10px;
  margin-right: 10px; 
  border-radius: 15px;
  box-shadow: rgba(45, 35, 66, 0.5) 0 2px 4px, rgba(45, 35, 66, 0.5) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
  background-color: #00b33c;
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease; 
}

.btn-edit:hover {
  background: linear-gradient(to bottom, #00b33c, white);
  color: black;
  transform: scale(1.02);
}

.btn-del {
  padding: 10px;
  margin-left: 10px;
  border-radius: 15px;
  box-shadow: rgba(45, 35, 66, 0.5) 0 2px 4px, rgba(45, 35, 66, 0.5) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
  background-color: #ff0000;
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease; 
}

.btn-del:hover {
  background: linear-gradient(to bottom, #ff0000, white);
  color: black;
  transform: scale(1.02);
}

.btn-delete,
.btn-cancel {
  width: 100px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-delete {
    padding: 10px;
     border-radius: 15px;
     box-shadow: rgba(45, 35, 66, 0.5) 0 2px 4px, rgba(45, 35, 66, 0.5) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
     background-color: #ff0000;
     border: none;
     color: white;
     cursor: pointer;
     transition: all 0.3s ease; 
   }
  

  .btn-delete:hover {
     background: linear-gradient(to bottom, #ff0000, white);
     color: black;
     transform: scale(1.02);
   }

  .btn-cancel {
    padding: 10px;
     border-radius: 15px;
     box-shadow: rgba(45, 35, 66, 0.5) 0 2px 4px, rgba(45, 35, 66, 0.5) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
     background-color: #6a6767;
     border: none;
     color: white;
     cursor: pointer;
     transition: all 0.3s ease; 
  }

  .btn-cancel:hover {
     background: linear-gradient(to bottom, #6a6767, white);
     color: black;
     transform: scale(1.02);
  }

.modal-backdrop {
  z-index: 1040;
}

.modal {
  z-index: 1050;
}

.modal-dialog-centered {
  display: flex;
  align-items: center;
  min-height: calc(100% - 1rem);
}

.modal-content {
  border-radius: 0.5rem;
  padding: 1rem;
}

.modal-header {
  border-bottom: none;
  padding-bottom: 0;
}

.modal-title {
  font-weight: bold;
}

.modal-body {
  font-size: 1rem;
  color: #555;
  padding: 1.5rem 1rem;
}

.modal-footer {
  border-top: none;
  justify-content: space-between;
  padding-top: 0;
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.15);
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
@media (max-width: 768px) {
  .modal-footer .btn-cancel,
  .modal-footer .btn-delete {
    margin-top: 10px; 
  }
}

@media (max-width: 768px) {
  .modal-dialog {
    margin: auto;
  }
}
</style>

 
