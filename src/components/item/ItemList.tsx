import { defineComponent } from 'vue'
import { TimeTabsLayout } from '../../Layouts/TimeTabsLayOut'

import { ItemSummary } from './ItemSummary'
export const ItemList = defineComponent({
  setup(props, context) {
    return () => <TimeTabsLayout component={ItemSummary} />
  }
})
