// 检查localStorage中的game-storage值
const fs = require('fs');
const path = require('path');

// 模拟localStorage
class LocalStorage {
  constructor() {
    this.store = {};
  }
  
  getItem(key) {
    return this.store[key] || null;
  }
  
  setItem(key, value) {
    this.store[key] = value.toString();
  }
  
  removeItem(key) {
    delete this.store[key];
  }
  
  clear() {
    this.store = {};
  }
}

// 创建localStorage实例
global.localStorage = new LocalStorage();

// 读取game-storage文件
const storagePath = path.join(__dirname, 'game-storage.json');
if (fs.existsSync(storagePath)) {
  const storageData = fs.readFileSync(storagePath, 'utf8');
  try {
    const parsedData = JSON.parse(storageData);
    console.log('Local storage data:', parsedData);
    if (parsedData.state && parsedData.state.currentGenerals) {
      console.log('Current generals:', parsedData.state.currentGenerals);
      console.log('Length:', parsedData.state.currentGenerals.length);
    }
  } catch (error) {
    console.error('Error parsing storage data:', error);
  }
} else {
  console.log('No game-storage.json file found');
}

// 检查localStorage
console.log('LocalStorage game-storage:', localStorage.getItem('game-storage'));