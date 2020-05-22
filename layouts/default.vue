<template>
  <div class="app-container">
    <page-header :NavList="NavList"></page-header>
    <nuxt />
    <page-footer :NavList="NavList"></page-footer>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import PageHeader from "@/components/layout/page-header/page-header";
import PageFooter from "@/components/layout/page-footer/page-footer";
const NavList = [
  {
    link: "/",
    name: "首页"
  },
  {
    link: "/archive",
    name: "归档"
  },
  {
    link: "/sitemap",
    name: "标签"
  },
  {
    link: "/about",
    name: "关于"
  },
  {
    link: "/messages",
    name: "留言墙"
  }
];
export default {
  data() {
    return {
      NavList
    };
  },
  computed: {
    ...mapState("app", ["theme"])
  },
  methods: {
    ...mapMutations("app", ["setTheme"])
  },
  mounted() {
    // 第一种实现方法
    // this.setTheme(this.theme)
    //第二种实现方法
    const theme = window.localStorage.getItem("theme");
    this.setTheme(theme || "light");
  },
  components: {
    PageHeader,
    PageFooter
  }
};
</script>
<style>
@import "@/assets/scss/animation.scss";
.app-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
}
</style>

