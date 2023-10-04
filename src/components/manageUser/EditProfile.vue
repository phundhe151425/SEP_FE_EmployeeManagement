<template>
  <div>
    <h3>Chỉnh sửa thông tin</h3>
    <hr style="margin-bottom: 5%" />
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="200px"
      class="demo-ruleForm"
    >
      <div class="row">
        <div class="col-md-6">
          <div class="left">
            <el-form-item label="Nhập họ tên nhân viên" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>

            <el-form-item label="Nhập số điện thoại" prop="phone">
              <el-input v-model="ruleForm.phone"></el-input>
            </el-form-item>
            <div class="img">
              <p style="color: #606266; font-size: 14px">Nhập ảnh</p>
              <label>
                <img style="width: 200px; height: 200px" :src="imageUrl" />
                <input
                  @change="getImage($event)"
                  type="file"
                  class="form-control"
                  id="image"
                  accept="images/*"
                  required
                  name="image"
                  style="display: none"
                />
              </label>
            </div>
          </div>
        </div>
        <div class="col-md-6 right">
          <div class="right">
          <el-form-item label="Nhập địa chỉ" prop="address">
            <el-input v-model="ruleForm.address"></el-input>
          </el-form-item>
          <el-form-item label="Ngày sinh" required>
            <el-form-item prop="date">
              <el-date-picker
                type="date"
                placeholder="Pick a date"
                v-model="ruleForm.date"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-form-item>
          <el-form-item label="Giới tính" prop="sex">
            <el-radio-group v-model="ruleForm.sex">
              <el-radio :label="1">Nam</el-radio>
              <el-radio :label="2">Nũ</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button
             class="btn"
              type="primary"
              @click="submitForm('ruleForm')"
              >Lưu</el-button
            >
          </el-form-item>
          </div>
        </div>
      </div>
      <!-- <el-form-item label="Activity zone" prop="region">
    <el-select v-model="ruleForm.region" placeholder="Activity zone">
      <el-option label="Zone one" value="shanghai"></el-option>
      <el-option label="Zone two" value="beijing"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="Activity time" required>
    <el-col :span="11">
      <el-form-item prop="date1">
        <el-date-picker type="date" placeholder="Pick a date" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
      </el-form-item>
    </el-col>
    <el-col class="line" :span="2">-</el-col>
    <el-col :span="11">
      <el-form-item prop="date2">
        <el-time-picker placeholder="Pick a time" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
      </el-form-item>
    </el-col> -->
      <!-- </el-form-item> -->
      <!-- <el-form-item label="Instant delivery" prop="delivery">
    <el-switch v-model="ruleForm.delivery"></el-switch>
  </el-form-item>
  <el-form-item label="Activity type" prop="type">
    <el-checkbox-group v-model="ruleForm.type">
      <el-checkbox label="Online activities" name="type"></el-checkbox>
      <el-checkbox label="Promotion activities" name="type"></el-checkbox>
      <el-checkbox label="Offline activities" name="type"></el-checkbox>
      <el-checkbox label="Simple brand exposure" name="type"></el-checkbox>
    </el-checkbox-group>
  </el-form-item>
  <el-form-item label="Resources" prop="resource">
    <el-radio-group v-model="ruleForm.resource">
      <el-radio label="Sponsorship"></el-radio>
      <el-radio label="Venue"></el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="Activity form" prop="desc">
    <el-input type="textarea" v-model="ruleForm.desc"></el-input>
  </el-form-item> -->
      <!-- <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">Create</el-button>
    <el-button @click="resetForm('ruleForm')">Reset</el-button>
  </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
// import DataService from "../services/DataService";

export default {
  name: "edit-profile",
  data() {
    var checkName = (rule, value, callback) => {
      var re =
        /^[\sa-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s\\W|_]+$/;
      if (re.test(value) == false) {
        callback(new Error("Vui lòng nhập đúng định dạng tên"));
      }else{
        callback()
      }
    };
    var checkPhone = (rule, value, callback) => {
      var re = /^[0-9]+$/;
      if (re.test(value) == false) {
         callback(new Error("Vui lòng chỉ nhập số"));
      }else{
        callback()
      }
    };
    var checkAddress = (rule, value, callback) => {
      var re =
        /^[\sa-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s\\W|_]+$/;
      if (re.test(value) == false) {
        callback(new Error("Vui lòng nhập đúng định dạng địa chỉ"));
      }else{
        callback()
      }
    };
    return {
      ruleForm: {
        name: "",
        phone: "",
        address: "",
        date: "",
        sex: 1,
      },
      imageUrl: "",
      rules: {
        name: [
          {
            required: true,
            message: "Vui lòng nhập họ tên!",
            trigger: "blur",
          },
          {
            min: 3,
            message: "Tên có tối thiểu 3 chữ cái",
            trigger: "blur",
          },
          {
            validator: checkName,
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "Vui lòng nhập số điện thoại!",
            trigger: "blur",
          },
          {
            validator: checkPhone,
            trigger: "blur",
          },
        ],
        address: [
          {
            required: true,
            message: "Vui lòng nhập địa chỉ",
            trigger: "blur",
          },
          {
            validator: checkAddress,
            trigger: "blur",
          },
        ],
        date: [
          {
            type: "date",
            required: true,
            message: "Vui lòng chọn ngày sinh",
            trigger: "blur",
          },
        ],
        // sex: [
        //   {
        //     required: true,
        //     message: "Please select activity resource",
        //     trigger: "blur",
        //   },
        // ],
        // address: [
        //   {
        //     required: true,
        //     message: "Please select Activity zone",
        //     trigger: "change",
        //   },
        // ],

        // date2: [
        //   {
        //     type: "date",
        //     required: true,
        //     message: "Please pick a time",
        //     trigger: "change",
        //   },
        // ],
        // type: [
        //   {
        //     type: "array",
        //     required: true,
        //     message: "Please select at least one activity type",
        //     trigger: "change",
        //   },
        // ],
      },
    };
  },
  methods: {
    getImage(event) {
      const file = event.target.files[0];

      const theReader = new FileReader();
      theReader.onloadend = () => {
        this.imageUrl = theReader.result;
      };
      theReader.readAsDataURL(file);
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        console.log(valid)
        if (valid) {
          
          this.$router.push("/profile");
          alert("submit!");
        } else {
          console.log(valid)
          console.log("error submit!!");
          return false;
        }
      });
    },
 
  },
  computed: {},
};
</script>

<style >
.el-form-item__label {
  text-align: left;
}

.left .el-form-item__label {
  margin-left: 22%;
}
.el-form-item {
  display: flex;
  flex-direction: column;
}

/* .mt-3{
    margin-top: 10% !important;
} */

.el-form-item__content {
  margin-left: 0px !important;
}

.el-input {
  width: 70% !important;
}

.left .el-input {
  margin-left: 22%;
}

.left .el-form-item__error {
  margin-left: 22%;
}
.img {
  margin-left: 22%;
}

.btn {
  border-radius: 15px;
  color: white;
  width: 20%;
  margin-top: 100px;
  margin-left: 49%;
  background-color: #75c4c0;
}
</style>