<template>
  <header class="header-container">
    <div class="header-logo">
      <switch-theme :size="'30px'"></switch-theme>
      <i class="logo">Keep Smile</i>
    </div>
    <nav class="nav-wrapper">
      <desktop-nav :NavList="NavList"></desktop-nav>
    </nav>
  </header>
</template>
<script>
import SwitchTheme from "@/components/base/switch-theme/switch-theme";
import DesktopNav from "@/components/base/nav/desktop-nav";
export default {
  props: {
    NavList: {
      type: Array,
      default: () => []
    }
  },
  components: {
    DesktopNav,
    SwitchTheme
  }
};
</script>
<style lang="scss">
.header-container {
  @include container;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 160px;
  width: 100%;
  max-width: 1200px;
  z-index: $index-top;
  @media (max-width: 479px) {
    height: 100px;
  }
}
.header-logo {
  .logo {
    font-size: $title-font-size-medium;
    margin-left: 10px;
  }
  .icon {
    font-size: $title-font-size-medium;
  }
}
</style>