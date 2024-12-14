// login.js
Page({
  data: {
    username: '',
    password: '',
    newUsername: '',
    newPassword: '',
    userId: null,
    showDialog: false,
    dialogMessage: ''
  },

  // 处理用户名输入
  onUsernameInput(e) {
    this.setData({ username: e.detail.value });
  },

  // 处理密码输入
  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  // 显示注册对话框
  showRegisterDialog() {
    this.setData({
      showDialog: true,
      dialogMessage: ''
    });
  },

  // 登录方法
  async testClick(e) {
    const userData = {
      username: this.data.username,
      password: this.data.password
    };

    try {
      const response = await this.login(userData); // 获取登录响应
      console.log(response); // 查看响应结构

      // 判断登录是否成功
      if (response && response.id !== undefined) {
        wx.navigateTo({
          url: `/pages/products/products?userId=${response.id}` // 跳转到产品页面
        });
        return true; // 登录成功，返回 true
      }
      return false; // 登录失败，返回 false
    } catch (error) {
      console.error("登录请求失败:", error);
      this.setData({ dialogMessage: '登录失败，用户名或密码错误' });
      return false; // 出现错误时，返回 false
    }
  },

  // 登录请求
  async login(userData) {
    try {
      const res = await wx.request({
        url: 'http://123.249.91.173:8080/user/login',
        method: 'POST',
        data: userData,
        header: {
          'Content-Type': 'application/json'
        },
        success(res) {
          return res.data; // 返回响应数据
        },
        fail(error) {
          throw new Error('登录失败，用户名或密码错误');
        }
      });
      return res.data;
    } catch (error) {
      throw new Error('登录失败，用户名或密码错误');
    }
  },

  // 注册请求
  async registerRequest(userData) {
    try {
      const res = await wx.request({
        url: 'http://123.249.91.173:8080/user/register',
        method: 'POST',
        data: userData,
        header: {
          'Content-Type': 'application/json'
        },
        success(res) {
          return res.data; // 返回注册响应数据
        },
        fail(error) {
          throw new Error('无法连接到服务器，注册失败');
        }
      });
      return res.data;
    } catch (error) {
      throw new Error('无法连接到服务器，注册失败');
    }
  },

  // 注册功能
  async register(e) {
    const registerData = {
      username: this.data.newUsername,
      password: this.data.newPassword
    };

    try {
      const response = await this.registerRequest(registerData); // 使用封装的注册请求
      this.setData({ dialogMessage: response.message });
    } catch (error) {
      this.setData({ dialogMessage: error.message });
    }
  },

  // 关闭注册对话框
  closeDialog() {
    this.setData({
      showDialog: false,
      dialogMessage: '',
      newUsername: '',
      newPassword: ''
    });
  },

  // 处理新用户名输入
  onNewUsernameInput(e) {
    this.setData({ newUsername: e.detail.value });
  },

  // 处理新密码输入
  onNewPasswordInput(e) {
    this.setData({ newPassword: e.detail.value });
  }
});
