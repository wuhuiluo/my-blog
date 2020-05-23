<template>
  <footer class="footer-container">
    <div class="footer-wrapper">
      <div class="between">
        <switch-theme :size="'18px'"></switch-theme>
        <span class="logo">Keep Smile</span>
      </div>
      <div class="menu-wrapper">
        <desktop-nav :NavList="NavList"></desktop-nav>
      </div>
      <div class="social-links between">
        <a href="mailto:510426343@qq.com" target="_blank">
          <i class="icon icon-mail"></i>
        </a>
        <a href="https://github.com/wuhuiluo" target="_blank">
          <i class="icon icon-github"></i>
        </a>
        <a href="https://blog.csdn.net/m0_46269977" target="_blank">
          <span class="text">CSDN</span>
        </a>
      </div>
    </div>
    <div class="footer-copyright">
      <span class="copyright">
        © 2020
        <span class="logo">Keep Smile</span>
      </span>. Believe YourSelf You Can
    </div>
    <div class="time">
      <span>网站已运行:</span>
      <span id="span"></span>
    </div>
  </footer>
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

  computed: {},

  methods: {
    runtime() {
      // 初始时间，日/月/年 时:分:秒
      let X = new Date("5/23/2020 14:00:00");
      let Y = new Date();
      let T = Y.getTime() - X.getTime();
      let M = 24 * 60 * 60 * 1000;
      let a = T / M;
      let A = Math.floor(a);
      let b = (a - A) * 24;
      let B = Math.floor(b);
      let c = (b - B) * 60;
      let C = Math.floor((b - B) * 60);
      let D = Math.floor((c - C) * 60);
      //信息写入到DIV中
      span.innerHTML = A + "天" + B + "小时" + C + "分" + D + "秒";
    }
  },

  mounted() {
    setInterval(this.runtime, 1000);
  },

  components: {
    SwitchTheme,
    DesktopNav
  }
};
</script>


<style lang="scss" scoped>
.footer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: $index-normal;
  width: 100%;
  .footer-wrapper {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    width: calc(100% - 85px - 85px); //动态计算宽度
    max-width: 1024px;
    margin-top: 8vh;
    padding: 0 15px 15px;
    @media (max-width: 1399px) {
      max-width: 950px;
    }
    @media (max-width: 1023px) {
      flex-direction: column;
    }
    @media (max-width: 479px) {
      width: 100%;
    }
    .menu-wrapper {
      @media (max-width: 1023px) {
        margin: 14px 0;
      }
    }
    .between {
      width: 120px;
      @media (max-width: 1023px) {
        display: flex;
        justify-content: center;
      }
    }
    .logo {
      margin-left: 8px;
      line-height: 1.8;
    }
    .social-links {
      display: flex;
      justify-content: flex-end;
      font-size: 1rem;
      @media (max-width) {
        justify-content: center;
      }
      a {
        display: flex;
        align-items: center;
        margin-left: 24px;
        &:first-child {
          margin-left: 0;
        }
        .text {
          white-space: nowrap;
          &:hover {
            color: var(--theme-active);
          }
        }
      }
      .icon {
        font-size: $font-size-icon-rem;
        &:hover {
          color: var(--theme-active);
        }
      }
    }
  }

  .footer-copyright {
    padding: 25px 30px;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.3;
    margin: 0 auto;
    text-align: center;
    letter-spacing: 0.7px;
    color: var(--font-color-light);
    .copyright {
      font-weight: $font-weight-bold;
      .logo {
        color: var(--font-color-dark);
      }
    }
    .record-number {
      margin-top: 10px;
    }
  }
}

.time {
  color: black;
  font-weight: 400;
  font-size: 20px;
  margin-bottom: 30px;
}
</style>