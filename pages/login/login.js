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
      console.log(response); // 打印返回数据，调试用
  
      // 判断登录是否成功
      if (response && response.id !== undefined) {
        wx.navigateTo({
          url: `/pages/products/products?userId=${response.id}` // 跳转到产品页面
        });
        return true; // 登录成功，返回 true
      }
      this.setData({ dialogMessage: '用户名或密码错误' }); // 显示错误消息
      return false; // 登录失败，返回 false
    } catch (error) {
      console.error("登录请求失败:", error);
      this.setData({ dialogMessage: '登录请求失败，请稍后再试' });
      return false; // 出现错误时，返回 false
    }
  },

  // 登录请求
  async login(userData) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'http://localhost:8080/user/login',
        method: 'POST',
        data: userData,
        header: {
          'Content-Type': 'application/json'
        },
        success(res) {
          if (res.statusCode === 200) {
            resolve(res.data); // 请求成功，返回响应数据
          } else {
            reject(new Error('登录失败，用户名或密码错误')); // 返回失败信息
          }
        },
        fail(error) {
          reject(new Error('登录请求失败，网络错误')); // 请求失败，返回错误
        }
      });
    });
  },

  // 注册请求
  registerRequest(userData) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'http://localhost:8080/user/register',
        method: 'POST',
        data: JSON.stringify(userData), // 确保数据是 JSON 字符串
        header: {
          'Content-Type': 'application/json'
        },
        success(res) {
          if (res.statusCode === 201) {
            resolve(res.data); // 请求成功，返回注册响应数据
          } else if (res.statusCode === 409) {
            // 处理用户名已存在的错误
            reject(new Error('用户名已存在，请选择其他用户名'));
          } else {
            reject(new Error(res.data.message || '注册失败'));
          }
        },
        fail(error) {
          reject(new Error('无法连接到服务器，注册失败'));
        }
      });
    });
  },

  // 注册功能
  async register(e) {
    const registerData = {
      username: this.data.newUsername,
      password: this.data.newPassword
    };

    try {
      const response = await this.registerRequest(registerData); // 使用封装的注册请求

      // 判断后端返回的响应内容
      if (response.message === '用户注册成功') {
        this.setData({ dialogMessage: '用户注册成功！' }); // 显示注册成功消息
        setTimeout(() => {
          this.closeDialog();  // 注册成功后，关闭对话框
        }, 2000); // 2秒后关闭对话框
      } else {
        this.setData({ dialogMessage: '注册成功' }); // 其他未知错误
      }
    } catch (error) {
      this.setData({ dialogMessage: error.message }); // 显示错误信息
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
  },

  // 注册按钮点击事件
  handleRegisterClick: function() {
    this.register(); // 直接调用注册方法
  }
});
