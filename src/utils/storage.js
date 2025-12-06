// 数据持久化工具类
// 使用localStorage存储数据，实现数据持久化

class StorageUtil {
  /**
   * 保存数据到localStorage
   * @param {string} key 存储键名
   * @param {any} data 要存储的数据
   */
  static saveData(key, data) {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
      return true;
    } catch (error) {
      console.error(`保存数据到localStorage失败: ${error.message}`);
      return false;
    }
  }

  /**
   * 从localStorage获取数据
   * @param {string} key 存储键名
   * @param {any} defaultValue 默认值（当数据不存在时返回）
   * @returns {any} 存储的数据或默认值
   */
  static getData(key, defaultValue = null) {
    try {
      const serializedData = localStorage.getItem(key);
      if (serializedData === null) {
        return defaultValue;
      }
      return JSON.parse(serializedData);
    } catch (error) {
      console.error(`从localStorage获取数据失败: ${error.message}`);
      return defaultValue;
    }
  }

  /**
   * 删除localStorage中的数据
   * @param {string} key 存储键名
   */
  static removeData(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`从localStorage删除数据失败: ${error.message}`);
      return false;
    }
  }

  /**
   * 清空所有localStorage数据
   */
  static clearAll() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error(`清空localStorage失败: ${error.message}`);
      return false;
    }
  }

  /**
   * 检查localStorage中是否存在指定键的数据
   * @param {string} key 存储键名
   * @returns {boolean} 是否存在
   */
  static hasData(key) {
    return localStorage.getItem(key) !== null;
  }
}

export default StorageUtil;