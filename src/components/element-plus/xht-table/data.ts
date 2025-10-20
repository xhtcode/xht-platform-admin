// 定义数据结构接口（明确各字段类型）
import { useMessage } from '@/hooks/use-message'

export interface TableData {
  id: string // UUID格式的唯一ID
  date: string // 日期格式：YYYY-MM-DD
  name: string // 中文姓名
  state: string // 中文省份
  city: string // 中文城市
  address: string // 中文地址
  zip: string // 邮政编码（6位数字字符串）
  tag: string // 中文标签
}

// 生成UUID（v4版本，返回string类型）
const generateUUID = (): string => {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// 生成模拟数据的函数（参数为数量，返回TableData数组）
const generateChineseContentData = (count: number = 5): TableData[] => {
  // 中文内容数据池（明确类型为string[]）
  const chineseNames: string[] = ['张三', '李四', '王五', '赵六', '陈七', '刘八', '杨九', '周十']
  const chineseStates: string[] = [
    '广东省',
    '江苏省',
    '浙江省',
    '四川省',
    '山东省',
    '河南省',
    '河北省',
  ]
  // 城市映射表（键为省份，值为城市数组，类型为Record<string, string[]>）
  const chineseCities: Record<string, string[]> = {
    广东省: ['广州市', '深圳市', '佛山市', '东莞市'],
    江苏省: ['南京市', '苏州市', '无锡市', '常州市'],
    浙江省: ['杭州市', '宁波市', '温州市', '绍兴市'],
    四川省: ['成都市', '绵阳市', '宜宾市'],
    山东省: ['济南市', '青岛市', '烟台市'],
    河南省: ['郑州市', '洛阳市', '开封市'],
    河北省: ['石家庄市', '唐山市', '保定市'],
  }
  const chineseStreets: string[] = [
    '长安街',
    '人民路',
    '解放路',
    '中山路',
    '科技园路',
    '滨江路',
    '文化路',
  ]
  const chineseTags: string[] = ['家庭', '办公', '临时', '常用', '紧急']

  // 生成随机日期（返回YYYY-MM-DD格式的string）
  const getRandomDate = (): string => {
    const end = new Date()
    const start = new Date(end.setFullYear(end.getFullYear() - 1))
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    return randomDate.toISOString().split('T')[0]
  }

  // 生成随机中文地址（返回string）
  const getRandomAddress = (state: string, city: string): string => {
    const street = chineseStreets[Math.floor(Math.random() * chineseStreets.length)]
    const num = Math.floor(Math.random() * 300) + 1 // 门牌号1-300
    return `${state}${city}${street}${num}号`
  }

  // 生成随机邮政编码（返回6位数字string）
  const getRandomZip = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // 批量生成数据（返回TableData数组）
  const result: TableData[] = []
  for (let i = 0; i < count; i++) {
    const state = chineseStates[Math.floor(Math.random() * chineseStates.length)]
    const city = chineseCities[state][Math.floor(Math.random() * chineseCities[state].length)]

    result.push({
      id: generateUUID(),
      date: getRandomDate(),
      name: chineseNames[Math.floor(Math.random() * chineseNames.length)],
      state: state,
      city: city,
      address: getRandomAddress(state, city),
      zip: getRandomZip(),
      tag: chineseTags[Math.floor(Math.random() * chineseTags.length)],
    })
  }
  return result
}
/**
 * 模拟网络请求：随机休眠0-10秒后返回数据
 * @param count 需要生成的数据条数（默认5条）
 * @returns Promise<TableData[]> 包含模拟数据的Promise
 */
const fetchTableData = (count: number = 10): Promise<TableData[]> => {
  return new Promise((resolve) => {
    // 延迟后返回生成的数据
    setTimeout(() => {
      const data = generateChineseContentData(count)
      resolve(data)
    }, 1000)
  })
}

export { fetchTableData }
