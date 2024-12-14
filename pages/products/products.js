Page({
  data: {
    userId: null,
    products: [],
    newProduct: {
      productName: "",
      productType: "",
      expiryDate: "",
      userId: null,
    },
    showDialog: false,
    dialogMessage: "",
    selectedType: "", // 筛选的产品类型
    productTypes: ['食物', '药品', '日常用品']
  },

  onLoad(options) {
    if (options.userId) {
      this.setData({
        userId: options.userId,
        'newProduct.userId': options.userId
      });
      this.loadProducts(); // 初始化加载产品列表
    } else {
      console.error("未接收到有效的用户ID");
      this.showError("未找到用户ID，请重新登录。");
    }
  },

  loadProducts() {
    wx.request({
      url: `http://123.249.91.173:8080/product/getProductsByUserId/${this.data.userId}`,
      method: "GET",
      success: (res) => {
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

  filterProducts(e) {
    const selectedType = e.detail.value;
    this.setData({ selectedType });
    let url = `http://123.249.91.173:8080/product/getProductsByUserIdAndType?userId=${this.data.userId}&productType=${selectedType}`;

    wx.request({
      url: url,
      method: "GET",
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({ products: res.data });
        } else {
          this.showError("筛选失败：" + (res.data.message || "未知错误"));
        }
      },
      fail: () => {
        this.showError("筛选产品失败，请检查网络！");
      },
    });
  },

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
        if (res.statusCode === 201) {
          this.showSuccess("产品添加成功！");
          this.loadProducts(); // 重新加载产品列表
          this.closeDialog(); // 关闭对话框
        } else {
          this.showError("添加失败：" + (res.data?.message || "未知错误"));
        }
      },
      fail: () => {
        this.showError("添加产品失败，请检查网络！");
      },
    });
  },

  deleteProduct(e) {
    const productId = e.currentTarget.dataset.id;
    wx.request({
      url: `http://123.249.91.173:8080/product/delete/${productId}`,
      method: "DELETE",
      success: () => {
        this.showSuccess("产品删除成功！");
        this.loadProducts(); // 重新加载产品列表
      },
      fail: () => {
        this.showError("删除产品失败，请检查网络！");
      },
    });
  },

  showSuccess(message) {
    this.setData({ dialogMessage: message, showDialog: true });
  },

  showError(message) {
    this.setData({ dialogMessage: message, showDialog: true });
  },

  closeDialog() {
    this.setData({ showDialog: false, dialogMessage: "", newProduct: { productName: "", productType: "", expiryDate: "", userId: this.data.userId } });
  },

  showAddProductDialog() {
    this.setData({ showDialog: true });
  },

  updateProductName(e) {
    this.setData({ 'newProduct.productName': e.detail.value });
  },

  updateProductType(e) {
    this.setData({ 'newProduct.productType': e.detail.value });
  },

  updateExpiryDate(e) {
    this.setData({ 'newProduct.expiryDate': e.detail.value });
  }
});
