Page({
  data: {
    userId: null,
    products: [],  // 存储产品数据
    newProduct: {
      productName: "",
      productType: "",
      expiryDate: "",
      userId: null,
    },
    showAddProductDialogVisible: false,  // 控制添加产品弹框显示
    showDeleteDialogVisible: false,  // 控制删除产品弹框显示
    deleteProductId: null,  // 存储待删除产品的ID
    dialogMessage: "",
    productTypes: ['food', 'medicine', 'daily_necessity'] // 产品类型列表
  },

  onLoad(options) {
    if (options.userId) {
      this.setData({
        userId: options.userId,
        'newProduct.userId': options.userId
      });
      console.log("用户ID:", options.userId);  // 调试用
      this.loadProducts(); // 初始化加载产品列表
    } else {
      console.error("未接收到有效的用户ID");
      this.showError("未找到用户ID，请重新登录。");
    }
  },

  // 加载用户的产品列表
  loadProducts() {
    wx.request({
      url: `http://123.249.91.173:8080/product/getProductsByUserId/${this.data.userId}`,
      method: "GET",
      success: (res) => {
        console.log(res); // 调试用，查看返回的数据
        if (res.statusCode === 200) {
          this.setData({ products: res.data });
        } else {
          this.showError("加载产品失败：" + (res.data.message || "未知错误"));
        }
      },
      fail: () => {
        this.showError("加载产品失败，请检查网络！");
      },
    });
  },

  // 根据产品类型筛选产品
  filterByType(e) {
    const selectedType = e.currentTarget.dataset.type;
    console.log("筛选产品类型:", selectedType);

    // 请求 URL，确保使用正确的 userId 和 selectedType
    const url = `http://123.249.91.173:8080/product/getProductsByUserIdAndType?userId=${this.data.userId}&productType=${selectedType}`;

    // 发送请求
    wx.request({
      url: url,
      method: "GET",
      header: {
        "Content-Type": "application/json",
      },
      success: (res) => {
        console.log("筛选产品返回:", res);

        if (res.statusCode === 200 && res.data) {
          // 更新 products 数据，刷新页面
          this.setData({
            products: res.data // 使用 setData 来更新绑定的 products 数据
          });
        } else {
          this.showError("筛选失败：" + (res.data?.message || "未知错误"));
        }
      },
      fail: (err) => {
        console.error("筛选产品失败:", err);
        this.showError("筛选产品失败，请检查网络！");
      },
    });
  },

  // 显示错误消息
  showError(message) {
    this.setData({ dialogMessage: message });
  },

  // 显示添加产品对话框
  showAddProductDialog() {
    this.setData({
      showAddProductDialogVisible: true,
    });
  },

  // 关闭添加产品对话框
  closeDialog() {
    this.setData({
      showAddProductDialogVisible: false,
      newProduct: { productName: "", productType: "", expiryDate: "", userId: this.data.userId }
    });
  },

  // 添加产品
  addProduct() {
    const requestData = {
      productName: this.data.newProduct.productName,
      productType: this.data.newProduct.productType,
      expiryDate: this.data.newProduct.expiryDate,
      userId: this.data.userId,
    };

    wx.request({
      url: "http://123.249.91.173:8080/product/add",
      method: "POST",
      data: requestData,
      success: (res) => {
        console.log(res); // 调试用，查看返回的数据
        if (res.statusCode === 200) {
          this.showSuccess("产品添加成功！");
          this.loadProducts(); // 重新加载产品列表
          this.closeDialog(); // 关闭添加对话框
        } else {
          this.showError("产品添加成功！" );
        }
      },
      fail: () => {
        this.showError("添加产品失败，请检查网络！");
      },
    });
  },

  // 显示删除产品确认对话框
  showDeleteDialog(e) {
    const productId = e.currentTarget.dataset.id;
    this.setData({
      showDeleteDialogVisible: true,
      deleteProductId: productId
    });
  },

  // 关闭删除对话框
  closeDeleteDialog() {
    this.setData({
      showDeleteDialogVisible: false,
      deleteProductId: null
    });
  },

    // 确认删除产品
    deleteProduct() {
      const productId = this.data.deleteProductId;
  
      wx.request({
        url: `http://123.249.91.173:8080/product/delete/${productId}`,
        method: "DELETE",
        success: () => {
          this.showSuccess("产品删除成功！");
          this.loadProducts(); // 重新加载产品列表
          this.closeDeleteDialog(); // 关闭删除确认对话框
        },
        fail: () => {
          this.showError("删除产品失败，请检查网络！");
        },
      });
    },
  
    // 显示成功消息
    showSuccess(message) {
      this.setData({ dialogMessage: message });
    },
  
    // 更新产品名称
    updateProductName(e) {
      this.setData({ 'newProduct.productName': e.detail.value });
    },
  
    // 更新产品类型
    updateProductType(e) {
      this.setData({ 'newProduct.productType': this.data.productTypes[e.detail.value] });
    },
  
    // 更新过期日期
    updateExpiryDate(e) {
      this.setData({ 'newProduct.expiryDate': e.detail.value });
    }
  });
  