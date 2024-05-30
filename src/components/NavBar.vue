<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <button class="navbar-brand btn-link">
            <img :src="require('@/assets/logo-ecommerce.png')" width="30" height="30" alt="">
            LAZAPEE
        </button>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" href="/home">Home</a>
                </li>
            </ul>
            <button @click="showLogoutDialog = true" class="btn btn-danger ml-auto custom-logout-button">Logout</button>
        </div>
    </nav>

    <div v-if="showLogoutDialog" class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Confirm Logout</h5>
                   
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to log out?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-cancel btn-secondary" @click="showLogoutDialog = false">Cancel</button>
                    <button type="button" class="btn-logout btn-danger" @click="logout">Confirm</button>
                </div>
            </div>
        </div>
    </div>
    <div v-if="showLogoutDialog" class="modal-backdrop fade show"></div>
</template>

<script>
import axios from '@/lib/axios';

export default {
    data() {
        return {
            showLogoutDialog: false
        };
    },
    computed: {
        getAccountDetails() {
            return this.$store.getters.getAccountDetails;
        }
    },
    methods: {
        async logout() {
            try {
                const response = await axios.post('/api/logout', {
                    email: this.getAccountDetails.email
                });
                if (response.status == 200) {
                    localStorage.removeItem('token');
                    this.$store.dispatch('asyncLoadAccountDetails', []);
                    this.$store.dispatch('asyncLoadProducts', []);
                    this.$router.push('/');
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.showLogoutDialog = false;
            }
        }
    }
}
</script>

<style scoped>
.btn-link {
    border-color: transparent;
}
.modal-backdrop {
    z-index: 1040;
}
.modal {
    z-index: 1050;
}

.btn-logout, .btn-cancel {
    width: 100px; 
    padding: 10px 40px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .btn-logout{
     padding: 10px;
     border-radius: 15px;
     box-shadow: rgba(45, 35, 66, 0.5) 0 2px 4px, rgba(45, 35, 66, 0.5) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
     background-color: #ff0000;
     border: none;
     color: white;
     cursor: pointer;
     transition: all 0.3s ease; 
  }
  
  .btn-cancel{
     padding: 10px;
     border-radius: 15px;
     box-shadow: rgba(45, 35, 66, 0.5) 0 2px 4px, rgba(45, 35, 66, 0.5) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
     background-color: #6a6767;
     border: none;
     color: white;
     cursor: pointer;
     transition: all 0.3s ease; 
 
  }
  
  .btn-logout:hover {
    background: linear-gradient(to bottom, #ff0000, white);
    color: black;
    transform: scale(1.02);
  }
  
  .btn-cancel:hover {
    background: linear-gradient(to bottom, #6a6767, white);
    color: black;
    transform: scale(1.02);
 
  }
</style>
