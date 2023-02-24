<template>
  <a-card>
    <div class="container" style="max-width: 1100px; height: auto">
      <a-row class="form-inline" :gutter="20" type="flex" justify="start" align="middle">
        <a-col flex="80px">
          <b> 选择环境 </b>
        </a-col>
        <a-col style="width: 200px">
          <a-select placeholder="请选择" v-model:value="classData.env" style="width: 100%" @change="getOrg()">
            <a-select-option value="test1">test1</a-select-option>
            <a-select-option value="test2">test2</a-select-option>
            <a-select-option value="test3">test3</a-select-option>
          </a-select>
        </a-col>
        <a-col style="width: 80px">
          <b> 选择机构 </b>
        </a-col>
        <a-col style="width: 200px">
          <a-select :options="this.orgList" :style="components.select.style" @change="projectSelect" show-search />
        </a-col>
      </a-row>
      <br />
      <a-collapse activeKey="1">
        <a-collapse-panel header="快捷建课" key="1">
          <template #extra>
            <a-button
              type="link"
              style="height: 0px; font-size: 12px"
              @click="
                (event) => {
                  event.stopPropagation();
                  addClassroomData();
                }
              "
            >
              + 教室
            </a-button>
            <a-button
              type="link"
              style="height: 0px; font-size: 12px"
              @click="
                (event) => {
                  event.stopPropagation();
                  createClass();
                }
              "
              :disabled="components.btn.createClassroom.loading"
            >
              <b>创建</b>
            </a-button>
          </template>
          <div v-for="(classroomData, i) in classData.classroomList" :key="i">
            <hr v-show="i != 0" />
            <a-row :gutter="10" class="form-inline" type="flex">
              <a-col flex="50px"> 教室 {{ i + 1 }} </a-col>
              <a-col flex="35px"> 类型 </a-col>
              <a-col flex="100px">
                <a-select
                  v-model:value="classroomData.type"
                  style="width: 100%"
                  @change="
                    () => {
                      if (classroomData.type == 2) {
                        classroomData.studentList = [];
                      }
                    }
                  "
                >
                  <a-select-option v-for="(type, i) in classroom_types" :class="components.select.option_style" :key="i" :value="type.value">
                    <span style="font-size: 12px">{{ type.text }}</span>
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col flex="55px"> <span class="text-red"> * </span> 主讲 </a-col>
              <a-col flex="230px">
                <a-select
                  v-model:value="classroomData.teacherList"
                  mode="tags"
                  allow-clear
                  style="width: 100%"
                  @change="
                    () => {
                      if (classroomData.teacherList.length > 1) {
                        classroomData.teacherList = [classroomData.teacherList[1]];
                      }
                    }
                  "
                >
                  <a-select-option v-for="(teacher, i) in user_list.teacher" :key="i" :value="teacher">
                    <span style="font-size: 12px">{{ teacher }}</span>
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col flex="45px"> 学生 </a-col>
              <a-col flex="230px">
                <a-select
                  v-model:value="classroomData.studentList"
                  mode="tags"
                  allow-clear
                  style="width: 100%"
                  :token-separators="[',', '\n', ' ']"
                  :disabled="classroomData.type == 2"
                >
                  <a-select-option v-for="(student, i) in user_list.student" :key="i" :value="student">
                    <span style="font-size: 12px">{{ student }}</span>
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col flex="100px" v-show="classroomData.type != 2" />
              <a-col flex="100px" v-show="classroomData.type == 2">
                <button type="button" class="btn btn-sm btn-block btn-success" @click="addSubClassroomData(i)" :disabled="classroomData.type != 2">
                  + 子教室
                </button>
              </a-col>
              <a-col flex="100px">
                <button class="btn btn-sm btn-primary btn-block" type="button" @click="editClassroomData(i)"> 编辑教室 </button>
              </a-col>
              <a-col flex="100px">
                <button class="btn btn-sm btn-danger btn-block" type="button" @click="delClassroomData(i)" :disabled="classroomListLen() < 2">
                  删除教室
                </button>
              </a-col>
            </a-row>
            <div v-show="classroomData.type == 2" v-for="(subClassroomData, j) in classroomData.subClassroom" :key="j">
              <br />
              <a-row :gutter="10" class="form-inline" type="flex">
                <a-col flex="185px"> 子教室 {{ j + 1 }} </a-col>
                <a-col flex="55px"> <span class="text-red"> * </span> 助教 </a-col>
                <a-col flex="230px">
                  <a-select
                    mode="tags"
                    allow-clear
                    style="width: 100%"
                    v-model:value="subClassroomData.assistantList"
                    @change="
                      () => {
                        if (subClassroomData.assistantList.length > 1) {
                          subClassroomData.assistantList = [subClassroomData.assistantList[1]];
                        }
                      }
                    "
                  >
                    <a-select-option v-for="(teacher, i) in user_list.teacher" :key="i" :value="teacher">
                      <span style="font-size: 12px">{{ teacher }}</span>
                    </a-select-option>
                  </a-select>
                </a-col>
                <a-col flex="45px">学生</a-col>
                <a-col flex="230px">
                  <a-select v-model:value="subClassroomData.studentList" mode="tags" allow-clear style="width: 100%" :token-separators="[',', '\n', ' ']">
                    <a-select-option v-for="(student, i) in user_list.student" :key="i" :value="student">
                      <span style="font-size: 12px">{{ student }}</span>
                    </a-select-option>
                  </a-select>
                </a-col>
                <a-col flex="100px" v-show="classroomData.type == 2">
                  <button type="button" class="btn btn-sm btn-block btn-danger" @click="delSubClassroomData(i, j)" :disabled="subClassroomLen(i) < 2">
                    删除子教室
                  </button>
                </a-col>
                <a-col flex="200px" />
              </a-row>
            </div>
          </div>
        </a-collapse-panel>
        <a-collapse-panel header="教室添加用户" key="2">
          <template #extra>
            <a-button
              type="link"
              style="font-size: 12px; height: 0px"
              @click="
                (event) => {
                  event.stopPropagation();
                  addUser();
                }
              "
              :disabled="components.btn.classroomAddUser.loading"
            >
              添加
            </a-button>
          </template>
          <a-row :gutter="10" class="form-inline" type="flex">
            <a-col flex="85px">用户类型</a-col>
            <a-col flex="100px">
              <a-select
                v-model:value="addUserData.type"
                :style="components.select.style"
                @change="
                  () => {
                    if (addUserData.type == 2 || addUserData.type == 5) {
                      addUserData.userList = [];
                      user_list.add_user = user_list.teacher;
                    } else if (addUserData.type == 3 || addUserData.type == 4) {
                      addUserData.userList = [];
                      user_list.add_user = user_list.student;
                    }
                  }
                "
              >
                <a-select-option v-for="(type, i) in userTypes" :key="i" :value="type.value">
                  <span style="font-size: 12px">{{ type.text }}</span>
                </a-select-option>
              </a-select>
            </a-col>
            <a-col flex="55px"><span class="text-red"> * </span>教室ID</a-col>
            <a-col flex="230px">
              <a-input type="number" v-model:value="addUserData.classroomId" />
            </a-col>
            <a-col flex="45px">用户</a-col>
            <a-col flex="230px">
              <a-select
                v-show="addUserData.type == 3"
                v-model:value="addUserData.userList"
                allow-clear
                mode="tags"
                style="width: 100%"
                :token-separators="[',', '\n', ' ']"
              >
                <a-select-option v-for="(user, i) in user_list.add_user" :key="i" :value="user">
                  <span style="font-size: 12px">{{ user }}</span>
                </a-select-option>
              </a-select>
              <a-select
                v-show="addUserData.type == 2"
                v-model:value="addUserData.userList"
                allow-clear
                style="width: 100%"
                mode="tags"
                :token-separators="[',', '\n', ' ']"
                @change="
                  () => {
                    if (addUserData.userList.length > 1) {
                      addUserData.userList = [addUserData.userList[1]];
                    }
                  }
                "
              >
                <a-select-option v-for="(user, i) in user_list.add_user" :key="i" :value="user">
                  <span style="font-size: 12px">{{ user }}</span>
                </a-select-option>
              </a-select>
            </a-col>
            <a-col flex="300px" />
          </a-row>
        </a-collapse-panel>
      </a-collapse>
      <hr />
      <a-collapse activeKey="1">
        <a-collapse-panel header="输出信息" key="1" class="address-container">
          <a-textarea v-model:value="info" style="width: 100%; height: 600px" :auto-size="{ minRows: 15 }" disabled />
          <template #extra>
            <a-button
              type="link"
              style="font-size: 12px; height: 0px"
              @click="
                (event) => {
                  event.stopPropagation();
                  info = '';
                }
              "
            >
              清空
            </a-button>
          </template>
        </a-collapse-panel>
      </a-collapse>
      <br /><br /><br />
    </div>
    <a-modal
      :visible="components.modal.edit_classroom_data.visible"
      @ok="components.modal.edit_classroom_data.func"
      @cancel="components.modal.edit_classroom_data.visible = false"
      width="500px"
    >
      <template #title>
        <span class="form-inline">编辑教室</span>
      </template>
      <a-row :gutter="20" class="form-inline" type="flex">
        <a-col flex="100px">教室名称</a-col>
        <a-col flex="300px">
          <a-input type="text" style="width: 100%" v-model:value="components.modal.edit_classroom_data.data.classroomName" />
        </a-col>
      </a-row>
      <br />
      <a-row :gutter="20" class="form-inline" type="flex">
        <a-col flex="100px">开始时间</a-col>
        <a-col flex="300px">
          <a-date-picker
            show-time
            style="width: 100%; font-size: 12px"
            :disabled-date="disabledDate"
            v-model:value="components.modal.edit_classroom_data.data.startTime"
            @change="dateTimeChange(val)"
          />
        </a-col>
      </a-row>
      <br />
      <a-row :gutter="20" class="form-inline" type="flex">
        <a-col flex="100px">教室时长</a-col>
        <a-col flex="200px">
          <a-input
            type="number"
            style="width: 100%; font-size: 12px"
            suffix="小时"
            v-model:value="components.modal.edit_classroom_data.data.classHour"
            @change="
              () => {
                if (components.modal.edit_classroom_data.data.classHour < 0) {
                  components.modal.edit_classroom_data.data.classHour = 0;
                }
                if (components.modal.edit_classroom_data.data.classHour > 24) {
                  components.modal.edit_classroom_data.data.classHour = 24;
                }
              }
            "
          />
        </a-col>
      </a-row>
      <br />
      <a-row :gutter="20" class="form-inline" type="flex">
        <a-col flex="100px">提前进入时长</a-col>
        <a-col flex="200px">
          <a-input
            type="number"
            style="width: 100%; font-size: 12px"
            suffix="秒"
            v-model:value="components.modal.edit_classroom_data.data.preEnterTime"
            @change="
              () => {
                if (components.modal.edit_classroom_data.data.preEnterTime < 0) {
                  components.modal.edit_classroom_data.data.preEnterTime = 0;
                }
                if (components.modal.edit_classroom_data.data.preEnterTime > 86400) {
                  components.modal.edit_classroom_data.data.preEnterTime = 86400;
                }
              }
            "
          />
        </a-col>
      </a-row>
      <br />
      <a-row :gutter="20" class="form-inline" type="flex">
        <a-col flex="100px">拖堂时长</a-col>
        <a-col flex="200px">
          <a-input
            type="number"
            style="width: 100%; font-size: 12px"
            suffix="秒"
            v-model:value="components.modal.edit_classroom_data.data.extendTime"
            @change="
              () => {
                if (components.modal.edit_classroom_data.data.extendTime < 0) {
                  components.modal.edit_classroom_data.data.extendTime = 0;
                }
                if (components.modal.edit_classroom_data.data.extendTime > 86400) {
                  components.modal.edit_classroom_data.data.extendTime = 86400;
                }
              }
            "
          />
        </a-col>
      </a-row>
    </a-modal>
  </a-card>
</template>

<script>
  import { defineComponent } from 'vue';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import 'bootstrap/dist/js/bootstrap';
  import 'bootstrap-select/dist/js/bootstrap-select';
  import 'bootstrap-select/dist/css/bootstrap-select.min.css';
  import { orgList, createClassroom, addUsers } from './api';
  import moment from 'moment';

  export default defineComponent({
    components: {},
    setup() {
      return {
        // text,
        // activeKey,
        // expandIconPosition,
        // handleClick,
      };
    },
    data() {
      return {
        classData: {
          env: '',
          org: '',
          classId: '',
          classroomList: [
            {
              classroomName: '',
              type: 1,
              classHour: 20,
              preEnterTime: 1200,
              extendTime: 0,
              startTime: moment(moment().valueOf() + 1200000),
              teacher: '',
              teacherList: [],
              assistant: '',
              assistantList: [],
              studentList: [],
              subClassroom: [
                {
                  assistant: '',
                  assistantList: [],
                  studentList: [],
                },
              ],
            },
          ],
        },
        addUserData: {
          classroomId: '',
          type: 2,
          userList: [],
          addUserDataSelectMode: '',
        },
        info: '',
        orgList: [
          {
            label: '常用机构',
            options: [],
          },
          {
            label: '可选机构',
            options: [],
          },
        ],
        env_list: [],
        user_list: {
          teacher: [],
          student: [],
          add_user: [],
        },
        classroom_types: [
          {
            value: 1,
            text: '小班',
          },
          {
            value: 2,
            text: '分组班',
          },
          {
            value: 3,
            text: '精品班',
          },
          {
            value: 4,
            text: 'VIP班',
          },
          {
            value: 5,
            text: '超大班',
          },
          {
            value: 100,
            text: '录播',
          },
          {
            value: 101,
            text: '录播答疑',
          },
        ],
        userTypes: [
          {
            value: 2,
            text: '助教',
          },
          {
            value: 3,
            text: '学生',
          },
          // {
          //     value: 4,
          //     text: '旁听',
          // },
          // {
          //     value: 5,
          //     text: '管理员',
          // },
        ],
        components: {
          select: {
            size: 'mini',
            style: 'width: 100%',
            option_style: 'optionClass',
            title: '请选择',
            popper: 'select-popper',
            maxTagCount: 10,
          },
          modal: {
            edit_classroom_data: {
              title: '',
              func: '',
              visible: false,
              data: {
                classroomName: '',
                classHour: 20,
                preEnterTime: 1200,
                extendTime: 0,
                startTime: moment(moment().valueOf() + 1200000),
              },
            },
          },
          btn: {
            createClassroom: {
              loading: false,
            },
            classroomAddUser: {
              loading: false,
            },
          },
        },
        url: {
          getOrg: '/qatools/inner/create/classroom/org',
          createClass: '/qatools/inner/create/classroom',
          addUser: '/qatools/inner/create/classroom/addUser',
          getUser: '/qatools/inner/create/classroom/frequently/account',
        },
      };
    },
    mounted() {
      this.getEnv();
      this.get_user();
    },
    methods: {
      res_callback(result, callback) {
        if (result.code == 200) {
          this.$message({
            type: 'success',
            message: result.message,
          });
          callback(result);
        } else {
          this.$message({
            type: 'error',
            message: result.message,
          });
        }
      },
      getEnv() {
        this.env_list = [
          { value: 'test1', text: 'test1', title: 'test1' },
          { value: 'test2', text: 'test2', title: 'test2' },
          { value: 'test3', text: 'test3', title: 'test3' },
        ];
      },
      projectSelect(value, option) {
        this.classData.org = option.id;
      },
      getOrg() {
        this.classData.org = '';
        this.classData.classId = null;
        this.debug(this.classData.env);
        orgList({ env: this.classData.env }).then((res) => {
          this.orgList[0].options = [];
          this.orgList[1].options = [];
          for (var i = 0; i < res.first.length; i++) {
            this.orgList[0].options.push({ lable: res.first[i].name, value: res.first[i].name, id: res.first[i].id });
          }
          for (var i = 0; i < res.secondary.length; i++) {
            this.orgList[1].options.push({ lable: res.secondary[i].name, value: res.secondary[i].name, id: res.first[i].id });
          }
        });
      },
      get_user() {
        this.user_list.teacher = [];
        this.user_list.student = [];
      },
      classroomListLen() {
        return this.classData.classroomList.length;
      },
      subClassroomLen(classroomIndex) {
        return this.classData.classroomList[classroomIndex].subClassroom.length;
      },
      addClassroomData() {
        if (this.classData.classroomList.length == 10) {
          return;
        }
        this.classData.classroomList.push({
          classroomName: '',
          type: 1,
          classHour: 20,
          teacher: '',
          teacherList: [],
          assistant: '',
          assistantList: [],
          studentList: [],
          subClassroom: [
            {
              assistant: '',
              assistantList: [],
              studentList: [],
            },
          ],
        });
      },
      editClassroomData(index) {
        this.components.modal.edit_classroom_data.data = this.classData.classroomList[index];
        this.components.modal.edit_classroom_data.visible = true;
        this.components.modal.edit_classroom_data.func = () => {
          this.classData.classroomList[index] = this.components.modal.edit_classroom_data.data;
          this.components.modal.edit_classroom_data.visible = false;
        };
      },
      delClassroomData(index) {
        if (this.classData.classroomList.length == 1) {
          return;
        }
        this.classData.classroomList.splice(index, 1);
      },
      addSubClassroomData(classroomIndex) {
        if (this.classData.classroomList[classroomIndex].subClassroom.length == 10) {
          return;
        }
        this.classData.classroomList[classroomIndex].subClassroom.push({
          assistant: '',
          assistantList: [],
          studentList: [],
        });
      },
      delSubClassroomData(classroomIndex, index) {
        if (this.classData.classroomList[classroomIndex].subClassroom.length == 1) {
          return;
        }
        this.classData.classroomList[classroomIndex].subClassroom.splice(index, 1);
      },
      createClass() {
        this.components.btn.createClassroom.loading = true;
        for (let i in this.classData.classroomList) {
          this.classData.classroomList[i].teacher = this.classData.classroomList[i].teacherList[0];
          this.classData.classroomList[i].assistant = this.classData.classroomList[i].assistantList[0];
          this.classData.classroomList[i].startTime = moment(this.classData.classroomList[i].startTime).valueOf() / 1000;
          this.classData.classroomList[i].classHour = Math.round(this.classData.classroomList[i].classHour);
          if (this.classData.classroomList[i].classroomName == '') {
            if (this.classData.classroomList[i].type == 1) {
              this.classData.classroomList[i].classroomName = '小班_';
            } else if (this.classData.classroomList[i].type == 2) {
              this.classData.classroomList[i].classroomName = '分组班_';
              this.classData.classroomList[i].studentList = [];
            } else if (this.classData.classroomList[i].type == 3) {
              this.classData.classroomList[i].classroomName = '精品班_';
            } else if (this.classData.classroomList[i].type == 4) {
              this.classData.classroomList[i].classroomName = 'VIP班_';
            } else if (this.classData.classroomList[i].type == 5) {
              this.classData.classroomList[i].classroomName = '超大班_';
            } else if (this.classData.classroomList[i].type == 100) {
              this.classData.classroomList[i].classroomName = '录播_';
            } else if (this.classData.classroomList[i].type == 101) {
              this.classData.classroomList[i].classroomName = '录播答疑_';
            }
            this.classData.classroomList[i].classroomName += String(new Date().valueOf()).slice(6);
          }

          for (let j in this.classData.classroomList[i].subClassroom) {
            this.classData.classroomList[i].subClassroom[j].assistant = this.classData.classroomList[i].subClassroom[j].assistantList[0];
          }
        }
        createClassroom(this.classData).then((res) => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: res.message,
              });
              for (let i in this.classData.classroomList) {
                this.classData.classroomList[i].classroomName = '';
              }
              this.info += JSON.stringify(res.result, null, '\t') + '\n';
              this.get_user();
            } else {
              this.$message({
                type: 'error',
                message: res.message,
              });
            }
            for (let i in this.classData.classroomList) {
              this.classData.classroomList[i].startTime = moment(this.classData.classroomList[i].startTime * 1000);
            }
            this.components.btn.createClassroom.loading = false;
          })
          .catch((this.components.btn.createClassroom.loading = false));
      },
      addUser() {
        var data = {
          env: this.classData.env,
          classroomId: this.addUserData.classroomId,
          teacher: '',
          assistant: '',
          studentList: [],
        };
        if (this.addUserData.type == 2) {
          data.assistant = this.addUserData.userList[0];
        } else if (this.addUserData.type == 3) {
          data.studentList = this.addUserData.userList;
        }
        this.components.btn.classroomAddUser.loading = true;
        addUsers(data).then((res) => {
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: res.message,
            });
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
          this.components.btn.classroomAddUser.loading = false;
        });
      },
      disabledDate(current) {
        return current < moment().subtract(0, 'days');
      },
      dateTimeChange() {
        this.debug('change');
        if (moment(moment().valueOf() + 1200000).isAfter(this.components.modal.edit_classroom_data.data.startTime)) {
          this.components.modal.edit_classroom_data.data.startTime = moment(moment().valueOf() + 1200000);
        }
      },
      debug(info) {
        console.log('--------- test ---------');
        console.log(info);
        console.log('--------- test ---------');
      },
    },
  });
</script>

<style scoped>
  .a-col {
    font-size: 12px;
    text-align: right;
    margin-top: 8px;
    margin-bottom: 8px;
  }

  button {
    font-size: 12px;
  }

  .text-header {
    text-align: left;
    font-size: 16px;
  }

  .text-red {
    color: crimson;
  }

  .text-secondary {
    color: dimgray;
  }

  .form-inline {
    font-size: 12px;
    text-align: right;
  }

  .optionClass {
    font-size: 12px;
    height: 30px;
    line-height: 30px;
  }

  .form-control {
    height: 28px;
    font-size: 9px;
  }
</style>
