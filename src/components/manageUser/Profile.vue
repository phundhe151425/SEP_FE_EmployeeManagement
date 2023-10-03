<template>
<div>
    <div class="infor">
        <h4 style="text-align: center">Thông tin nhân viên</h4>    
    </div>
    <div class="container">
  <div class="row">
    <div class="col-md-5 ">
      <img class="img" src="https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2023/02/Hinh-anh-avatar-Facebook.jpg?ssl=1"/>
    </div>
    <div class="col-md-7">
        <div class="detail">
            <div class="item">
                <label>Họ và tên nhân viên</label>
                <p>Nguyễn Đức Thịnh</p>
            </div>
             <div class="item">
                <label>Mã nhân viên</label>
                <p>HE150050</p>
            </div>
             <div class="item">
                <label>Bộ phận</label>
                <p>Kinh doanh</p>
            </div>
             <div class="item">
                <label>Email</label>
                <p>thinih@gmail.com</p>
            </div>
             <div class="item">
                <label>Loại tài khoản</label>
                <p>parttime</p>
            </div>
             <div class="item">
                <label>Ngày sinh</label>
                <p> 09/07/2001</p>
            </div>
             <div class="item">
                <label>Giới tính</label>
                <p> Nam</p>
            </div> <div class="item">
                <label>Địa chỉ</label>
                <p> Hưng Yên</p>
            </div> <div class="item">
                <label>Số điện thoại</label>
                <p> 076755323</p>
            </div>
      </div>
      <button type="button" class="btn" @click="edit()">Chỉnh sửa</button>
    </div>
  </div>
</div>
</div>
</template>

<script>

//  import DataService from "../services/DataService";

export default {
  name: "user-profile",
  data() {
    return {
        currentUser: null,
    };
  },
  methods: {
    // getUser(id) {
    //   DataService.get(id)
    //     .then(response => {
    //         this.currentUser = response.data;
    //     //   this.value = this.currentTutorial.brandId;
    //     //   this.oldFile = this.currentTutorial.image;
    //     //   this.fileSrc = require('@/assets'+ this.currentTutorial.image);
    //     //   console.log(response.data);
    //     })
    //     .catch(e => {
    //       console.log(e);
    //     });
    // },
    edit: function(){
        this.$router.push('/editprofile');
    }
  },
  computed:{
  },  
  mounted() {
    // this.getUser(this.$route.params.id);
    // this.retrieveTutorials();
    // this.message = '';
    
  }
};
</script>

<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
.infor{
    background-color: #d9d9d9;
    border-radius: 10px 10px 0 0;
    height: 50px;
    width: 70%;
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
    width: 65%;
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
   margin-top: 100px;
   margin-left: 55%;
   background-color: #75c4c0;
}

</style>