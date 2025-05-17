/*
 * @Author: 一勺
 * @Date: 2025-05
 * @LastEditors: ZRMYDYCG
 * @LastEditTime: 2025-05
 * @Description: IndexDB 操作测试用例
 */
import 'fake-indexeddb/auto'
import { indexedDB } from 'fake-indexeddb'
import type { IndexDBData } from '../../../src/core/storage/indexDB'
import { IndexDBWrapper } from '../../../src/core/storage/indexDB'

interface TestData extends IndexDBData {
  name: string
  value: number
}

const TEST_DB_CONFIG = {
  dbName: 'TestDatabase',
  storeName: 'TestStore',
  version: 1,
}

describe('IndexDBWrapper', () => {
  let wrapper: IndexDBWrapper<TestData>

  beforeEach(() => {
    wrapper = new IndexDBWrapper<TestData>(TEST_DB_CONFIG)
  })

  afterEach(async () => {
    // 先关闭数据库连接
    wrapper.close()
    // 再删除数据库
    await new Promise<void>((resolve) => {
      const req = indexedDB.deleteDatabase(TEST_DB_CONFIG.dbName)
      req.onsuccess = () => resolve()
      req.onblocked = () => setTimeout(resolve, 100) // 处理可能的阻塞情况
    })
  })

  describe('构造函数', () => {
    it('应正确初始化数据库和存储对象', async () => {
      expect(wrapper).toBeInstanceOf(IndexDBWrapper)
      await expect(wrapper.add({ id: 1, name: 'test', value: 100 })).resolves.toBe(1)
    })
  })

  describe('add方法', () => {
    it('应成功添加数据并返回key', async () => {
      const result = await wrapper.add({ id: 'key1', name: 'Test Item', value: 42 })
      expect(result).toBe('key1')
    })

    it('添加重复id应触发错误', async () => {
      await wrapper.add({ id: 'dupKey', name: 'First', value: 1 })
      await expect(wrapper.add({ id: 'dupKey', name: 'Second', value: 2 })).rejects.toThrow(
        /ConstraintError|重复键/,
      )
    })
  })

  describe('get方法', () => {
    it('应正确获取已存在数据', async () => {
      await wrapper.add({ id: 'getKey', name: 'Get Test', value: 123 })
      const result = await wrapper.get('getKey')
      expect(result).toEqual({ id: 'getKey', name: 'Get Test', value: 123 })
    })

    it('获取不存在数据应返回undefined', async () => {
      const result = await wrapper.get('nonExistKey')
      expect(result).toBeUndefined()
    })
  })

  describe('update方法', () => {
    it('应覆盖已有数据', async () => {
      const testId = 'updateKey'
      await wrapper.add({ id: testId, name: 'Original', value: 0 })
      await wrapper.update({ id: testId, name: 'Updated', value: 1 })
      const result = await wrapper.get(testId)
      expect(result).toEqual({ id: testId, name: 'Updated', value: 1 })
    })
  })

  describe('delete方法', () => {
    it('应删除指定数据', async () => {
      const testId = 'deleteKey'
      await wrapper.add({ id: testId, name: 'ToDelete', value: 99 })
      expect(await wrapper.get(testId)).toBeDefined()
      await wrapper.delete(testId)
      expect(await wrapper.get(testId)).toBeUndefined()
    })
  })
})
