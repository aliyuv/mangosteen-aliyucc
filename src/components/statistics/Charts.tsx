import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { FormItem } from '../../shared/Form'
import s from './Charts.module.scss'
import { LineChart } from './LineChart'
import { PieChart } from './PieChart'
import { Bars } from './Bars'
import { http } from '../../shared/Http'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
type Data1Item = { happen_at: string; amount: number }
type Data1 = Data1Item[]
type Data2Item = { tag_id: number; tag: Tag; amount: number }
type Data2 = Data2Item[]
export const Charts = defineComponent({
  props: {
    startDate: {
      type: String as PropType<string>,
      required: false
    },
    endDate: {
      type: String as PropType<string>,
      required: false
    }
  },
  setup: (props) => {
    const kind = ref('expenses')
    const data1 = ref<Data1>([])
    const betterData1 = computed<[string, number][]>(() => {
      if (!props.startDate || !props.endDate) {
        return [];
      }
      const DAY = 24 * 60 * 60 * 1000; // 一天的毫秒数
      const startDate = dayjs(props.startDate).startOf('day').utcOffset(480); // 将起始日期转换为东八区时间
      const endDate = dayjs(props.endDate).startOf('day').utcOffset(480); // 将结束日期转换为东八区时间
      const diff = endDate.diff(startDate, 'millisecond'); // 计算日期范围的毫秒数
      const n = Math.floor(diff / DAY) + 1; // 计算天数，向下取整
      const data = [...data1.value]; // 复制数据数组，避免对原始数据进行修改

      return Array.from({ length: n }).map((_, i) => {
        const date = startDate.add(i, 'day'); // 计算当前日期
        const item = data[0];
        const amount = item && dayjs(item.happen_at).utcOffset(480).isSame(date, 'day') ? data.shift()!.amount : 0; // 判断当前日期是否有数据
        return [date.toISOString(), amount];
      });
    });
    const fetchData1 = async () => {
      const response = await http.get<{ groups: Data1; summary: number }>(
        '/items/summary',
        {
          happen_after: dayjs(props.startDate).startOf('day').toISOString(),
          happen_before: dayjs(props.endDate).endOf('day').toISOString(),
          kind: kind.value,
          group_by: 'happen_at'
        },
        {
          _mock: 'itemSummary',
          _autoLoading: true
        }
      )
      data1.value = response.data.groups
    }
    onMounted(fetchData1)
    watch(() => kind.value, fetchData1)
    watch(() => [props.startDate, props.endDate], fetchData1)

    const data2 = ref<Data2>([])
    const betterData2 = computed<{ name: string; value: number }[]>(() =>
      data2.value.map((item) => ({
        name: item.tag.name,
        value: item.amount
      }))
    )

    const betterData3 = computed<{ tag: Tag; amount: number; percent: number }[]>(() => {
      const total = data2.value.reduce((sum, item) => sum + item.amount, 0)
      return data2.value.map((item) => ({
        ...item,
        percent: Math.round((item.amount / total) * 100)
      }))
    })
    const fetchData2 = async () => {
      const response = await http.get<{ groups: Data2; summary: number }>(
        '/items/summary',
        {
          happen_after: dayjs(props.startDate).startOf('day').toISOString(),
          happen_before: dayjs(props.endDate).endOf('day').toISOString(),
          kind: kind.value,
          group_by: 'tag_id'
        },
        {
          _mock: 'itemSummary'
        }
      )
      data2.value = response.data.groups
    }
    onMounted(fetchData2)
    watch(() => kind.value, fetchData2)

    return () => (
      <div class={s.wrapper}>
        <FormItem
          label="类型"
          type="select"
          options={[
            { value: 'expenses', text: '支出' },
            { value: 'income', text: '收入' }
          ]}
          v-model={kind.value}
        />
        <LineChart data={betterData1.value} />
        <PieChart data={betterData2.value} />
        <Bars data={betterData3.value} />
      </div>
    )
  }
})
