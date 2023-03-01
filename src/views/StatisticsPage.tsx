import { defineComponent } from 'vue'
import { Charts } from '../components/statistics/Charts'
import TimeTabsLayOut from '../Layouts/TimeTabsLayOut'
export const StatisticsPage = defineComponent({
  setup(props, context) {
    return () => <TimeTabsLayOut component={Charts} rerenderOnSwitchTab={true} hideThisYear={true} />
  }
})

export default StatisticsPage
