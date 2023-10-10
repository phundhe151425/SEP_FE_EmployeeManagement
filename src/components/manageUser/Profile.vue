<template>
<div>
    <div class="infor">
        <h4 style="text-align: center">Thông tin nhân viên</h4>    
    </div>
     <!-- <loading v-model:active="isLoading"
                 :can-cancel="true"
                 :on-cancel="onCancel"
                 :is-full-page="fullPage"/> -->
    <div class="container">
  <div class="row">
    <div class="col-md-5 ">
      <img class="img" :src="file" />
    </div>
    <div class="col-md-7">
        <div class="detail" v-if="currentUser!=null">
            <div class="item">
                <label>Họ và tên nhân viên</label>
                <p>{{ currentUser.fullName }}</p>
            </div>
             <div class="item">
                <label>Mã nhân viên</label>
                <p>{{ currentUser.userCode }}</p>
            </div>
             <div class="item">
                <label>Bộ phận</label>
                <p>{{ currentUser.department.name }}</p>
            </div>
             <div class="item">
                <label>Email</label>
                <p>{{ currentUser.email }}</p>
            </div>
             <div class="item">
                <label>Loại tài khoản</label>
                <p>parttime</p>
            </div>
             <div class="item">
                <label>Ngày sinh</label>
                <p> {{dateFormat}}</p>
            </div>
             <div class="item">
                <label>Giới tính</label>
                <p v-if="currentUser.gender == 1"> Nam</p>
                <p v-else> Nữ</p>
            </div> <div class="item">
                <label>Địa chỉ</label>
                <p> {{currentUser.address}}</p>
            </div> <div class="item">
                <label>Số điện thoại</label>
                <p> {{currentUser.phone}}</p>
            </div>
      </div>
      <button type="button" class="btn" @click="edit()">Chỉnh sửa</button>
    </div>
  </div>
</div>
</div>
</template>

<script>

  import DataService from "../../services/user-service";
  import moment from "moment";
export default {
  name: "user-profile",
  data() {
    return {
      id:"",
      file:"",
      dateFormat: "",
        currentUser: null,
    };
  },
  methods: {
    getUser(id) {
      DataService.getProfile(id)
        .then(response => {
          console.log(response.data)
            this.currentUser = response.data;
            this.dateFormat = moment(String(this.currentUser.birthDay)).format("DD/MM/yyyy");
            this.file = require('@/assets/images/'+ this.currentUser.userImage)
            
        //   this.value = this.currentTutorial.brandId;
        //   this.oldFile = this.currentTutorial.image;
        //   this.fileSrc = require('@/assets'+ this.currentTutorial.image);
        //   console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    edit: function(){
        this.$router.push('/editprofile');
    }
  },
  computed:{
  },  
  beforeMount(){
    this.id = this.$store.state.auth.user.id;
  },
  mounted() {
     setTimeout(() => {this.getUser(this.id)},100)
    //this.getUser(this.id)
    // this.retrieveTutorials();
    // this.message = '';
    
  }
};
</script>

<style scoped>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
.infor{
    background-color: #d9d9d9;
    border-radius: 10px 10px 0 0;
    height: 50px;
    width: 58.5%;
    margin-left: auto;
    margin-right: auto;
}
h4{
    padding-top: 10px;
}
.box{
    text-align: center;
}
.img{
    margin-left: 35%;
    margin-top: 5%;
    height: 75%;
    width: 60%;
}
.detail{
     margin-top: 5%;
}
.detail .item{
    display: flex;
    justify-content: space-between;
     width: 75%;
     border-bottom: black solid;
     height: 35px;
     margin-bottom: 3%;

}

.btn{
   border-radius: 15px;
   color: white;
   width: 20%;
   margin-top: 40px;
   margin-left: 55%;
   background-color: #75c4c0;
}

</style>