<template>
  <i
    @click="switchTheme"
    :style="{fontSize: size}"
    :class="theme === 'light' ? 'icon-dark' : 'icon-light '"
    class="icon"
  ></i>
</template>


<script>
import { mapMutations, mapState } from "vuex";
export default {
  props: {
    size: {
      type: String,
      default: "30px"
    }
  },

  computed: {
    ...mapState("app", ["theme"])
  },
  methods: {
    ...mapMutations("app", ["setTheme"]),

    switchTheme() {
      if (this.theme === "light") {
        this.setTheme("dark");
      } else {
        this.setTheme("light");
      }
    }
  }
};
</script>


<style lang="scss">
.icon {
  cursor: pointer;
  transition: $theme-transition;
}
</style>
