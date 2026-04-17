// 检查localStorage中的game-storage值
import fs from 'fs';
import path from 'path';

// 读取game-storage文件
const storagePath = path.join(process.cwd(), 'game-storage.json');
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

// 检查是否存在localStorage相关文件
const files = fs.readdirSync(process.cwd());
console.log('Files in directory:', files.filter(file => file.includes('storage')));