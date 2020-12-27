<template>
<div class="home">
  <StudySpaceList />
</div>
</template>

<script lang="ts">
import {
  Component,
  Vue
} from 'vue-property-decorator'
import StudySpaceList from '@/components/StudySpaceList.vue'


@Component({
  components: {
    StudySpaceList,
  },
})

export default class Home extends Vue {
}
</script>
