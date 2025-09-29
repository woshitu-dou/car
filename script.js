// 应用数据
const apps = {
  // 娱乐应用
  iqiyi: {
    name: "爱奇艺PAD",
    icon: '<i class="fa fa-play-circle text-2xl"></i>',
    bg: "bg-iqiyi/20",
    color: "text-iqiyi",
    url: "https://www.iqiyi.com/"
  },
  bilibili: {
    name: "哔哩哔哩HD",
    icon: '<i class="fa fa-play-circle text-2xl"></i>',
    bg: "bg-bilibili/20",
    color: "text-bilibili",
    url: "https://www.bilibili.com/"
  },
  tencent: {
    name: "腾讯视频HD",
    icon: '<i class="fa fa-play-circle text-2xl"></i>',
    bg: "bg-tencent/20",
    color: "text-tencent",
    url: "https://v.qq.com/"
  },
  youku: {
    name: "优酷HD",
    icon: '<i class="fa fa-play-circle text-2xl"></i>',
    bg: "bg-youku/20",
    color: "text-youku",
    url: "https://www.youku.com/"
  },
  
  // 常用应用
  wechat: {
    name: "微信",
    icon: '<i class="fa fa-weixin text-2xl"></i>',
    bg: "bg-wechat/20",
    color: "text-wechat",
    url: "https://wx.qq.com/"
  },
  qq: {
    name: "QQ",
    icon: '<i class="fa fa-qq text-2xl"></i>',
    bg: "bg-qq/20",
    color: "text-qq",
    url: "https://im.qq.com/"
  },
  browser: {
    name: "浏览器",
    icon: '<i class="fa fa-chrome text-2xl"></i>',
    bg: "bg-primary/20",
    color: "text-primary",
    url: "https://www.baidu.com/"
  },
  photos: {
    name: "相册",
    icon: '<i class="fa fa-picture-o text-2xl"></i>',
    bg: "bg-yellow-500/20",
    color: "text-yellow-500",
    url: "#photos"
  },
  music: {
    name: "音乐",
    icon: '<i class="fa fa-music text-2xl"></i>',
    bg: "bg-purple-500/20",
    color: "text-purple-500",
    url: "https://y.qq.com/"
  },
  settings: {
    name: "设置",
    icon: '<i class="fa fa-cog text-2xl"></i>',
    bg: "bg-gray-500/20",
    color: "text-gray-400",
    url: "#settings"
  }
};

// 显示提示信息
function showToast(message) {
  // 检查是否已存在toast元素，不存在则创建
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-dark/80 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-3 text-sm opacity-0 transition-opacity duration-300 z-50';
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.style.opacity = '1';
  
  setTimeout(() => {
    toast.style.opacity = '0';
  }, 3000);
}

// 更新当前时间
function updateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  // 更新所有时间显示元素
  document.querySelectorAll('.current-time').forEach(el => {
    el.textContent = `${hours}:${minutes}`;
  });
  
  // 更新日期显示
  const dateElements = document.querySelectorAll('.current-date');
  if (dateElements.length) {
    dateElements.forEach(el => {
      el.textContent = `${year}年${month}月${day}日`;
    });
  }
}

// 初始化时间更新
window.addEventListener('DOMContentLoaded', () => {
  updateTime();
  setInterval(updateTime, 60000);
  
  // 检查是否有启动应用的指令
  const urlParams = new URLSearchParams(window.location.search);
  const appToLaunch = urlParams.get('app');
  if (appToLaunch && typeof launchApp === 'function') {
    setTimeout(() => {
      launchApp(appToLaunch);
    }, 1000);
  }
});

// 设备连接管理
class DeviceConnector {
  constructor() {
    this.isConnected = false;
    this.deviceType = localStorage.getItem('deviceType') || '';
    this.init();
  }
  
  init() {
    // 尝试从localStorage恢复连接状态
    this.isConnected = localStorage.getItem('deviceConnected') === 'true';
    
    // 监听来自其他设备的消息
    window.addEventListener('storage', (e) => {
      if (e.key === 'remoteControl') {
        const command = JSON.parse(e.newValue);
        this.handleRemoteCommand(command);
      }
    });
  }
  
  setDeviceType(type) {
    this.deviceType = type;
    localStorage.setItem('deviceType', type);
  }
  
  connect() {
    this.isConnected = true;
    localStorage.setItem('deviceConnected', 'true');
    localStorage.setItem('lastConnection', new Date().toISOString());
    return true;
  }
  
  disconnect() {
    this.isConnected = false;
    localStorage.setItem('deviceConnected', 'false');
  }
  
  sendCommand(command) {
    if (!this.isConnected) return false;
    
    // 使用localStorage作为消息传递机制
    localStorage.setItem('remoteControl', JSON.stringify({
      type: command.type,
      data: command.data,
      from: this.deviceType,
      timestamp: new Date().getTime()
    }));
    
    // 立即清除以避免重复处理
    setTimeout(() => {
      localStorage.removeItem('remoteControl');
    }, 100);
    
    return true;
  }
  
  handleRemoteCommand(command) {
    // 忽略自己发送的命令
    if (command.from === this.deviceType) return;
    
    if (command.type === 'launchApp' && typeof launchApp === 'function') {
      launchApp(command.data.appId);
    }
  }
  
  getConnectionStatus() {
    return this.isConnected;
  }
}
