<template>
  <div>
    <NavBar></NavBar>
    <div class="container-lg d-flex flex-column my-4">
      <div class="m-2">
        <router-link to="/add" class="btn btn-primary">Add Product</router-link>
      </div>
      <h1 class="text-center">Welcome, {{ this.getAccountDetails.name }}</h1>

      <div v-if="getProducts.length < 1" class="text-center mt-5">
        <h3>Seems empty here!</h3>
      </div>
      <div v-else class="d-flex flex-column align-items-center">
        <h1>My Products</h1>
        <div class="table-responsive-sm w-100">
          <table class="table table-hover table-bordered">
            <thead>
              <tr>
                <th class="p-2">Name</th>
                <th class="p-2">Description</th>
                <th class="p-2">Price</th>
                <th class="p-2">Stocks</th>
                <th class="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in this.getProducts" :key="product.name" :class="{ 'fade-out': product.deleted }">
                <td>{{ product.name }}</td>
                <td>{{ product.description }}</td>
                <td>{{ product.price }}</td>
                <td>{{ product.stocks }}</td>
                <td>
                  <div class="d-flex justify-content-center">
                    <button @click="gotoEdit(product.id)" class="m-2 btn-edit">Edit</button>
                    <button @click="confirmDelete(product)" class="m-2 btn-del">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="showDeleteDialog" class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
      <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this product?</p>
          </div>
          <div class="modal-footer d-flex justify-content-between">
            <button type="button" class="btn-cancel btn-secondary" @click="showDeleteDialog = false">Cancel</button>
            <button type="button" class="btn-delete btn-danger" @click="deleteProduct">Delete</button>
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

    async deleteProduct() {
      try {
        const response = await axios.delete('/api/products/delete/' + this.productToDelete.id);
        if (response.status == 200) {
          this.productToDelete.deleted = true;

      
          this.$store.dispatch('asyncDeleteProduct', this.productToDelete);

          setTimeout(() => {
            alert("Product " + this.productToDelete.name + " is deleted");
          }, 500); 

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
.btn {
  border-radius: 50px;
  padding: 10px 20px;
  transition: all 0.3s ease;
}

.btn-edit {
  padding: 10px;
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

.btn-delete, .btn-cancel {
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

.btn-delete:hover {
  background: linear-gradient(to bottom, #ff0000, white);
  color: black;
  transform: scale(1.02);
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
  transform: translateX(100%);
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

