<template>
  <div class="editor-container">
    <img class="avatar" v-if="!isMessageEditor" :src="avatar" />
    <section class="comment-wrapper">
      <transition-group class="slide-wrapper" tag="div" name="list-slide">
        <!-- 回复内容区域 -->
        <section class="list-slide-item reply-item" v-if="isShowReplyContent" :key="1">
          <div v-if="isShowReplyContent" class="reply-target">
            <i class="icon icon-ant-close"></i>
            <strong class="reply-author">@{{reply.nickname}}</strong>
            <div class="reply-content markdown" v-html="reply.content"></div>
          </div>
        </section>
        <!-- 评论内容区域 -->
        <section class="list-slide-item" :key="2">
          <div
            @keyup="contentChange"
            @click="getCursorPosition"
            ref="editContent"
            class="editor"
            contenteditable="true"
            :placeholder="isMessageEditor ? '我想说...': '评论点什么' "
          ></div>
        </section>
        <!-- 工具栏 -->
        <section :key="3" class="list-slide-item tools-wrapper tools-item">
          <div class="editor-tools">
            <a
              @click="isShowEmoji = true"
              v-click-outside="() => {isShowEmoji = false}"
              class="tool-item"
            >
              <i class="icon icon-smile"></i>
              <ul class="emoji-wrapper" v-show="isShowEmoji">
                <li
                  @click.stop="insertEmoji(emoji)"
                  class="emoji-item"
                  v-for="(emoji,index) in emojiList"
                  :key="index"
                >{{emoji}}</li>
              </ul>
            </a>
            <a class="tool-item" @click="insertContent('image')">
              <i class="icon icon-image"></i>
            </a>
            <a class="tool-item" @click="insertContent('link')">
              <i class="icon icon-link"></i>
            </a>
            <a class="tool-item" @click="insertContent('code')">
              <i class="icon icon-code"></i>
            </a>
          </div>
          <a class="tool-item" @click="debouncedSend">
            <i class="icon icon-send"></i>
          </a>
        </section>
        <div class="list-slide-item user-item" :key="4">
          <section class="user-wrapper" :key="3">
            <input
              v-model="form.nickname"
              maxlength="14"
              class="user-input"
              :required="isMessageEditor ? false : true"
              name="text"
              type="text"
              :placeholder="isMessageEditor ? '昵称(非必填)' : '昵称(必填)'"
            />
            <input
              v-model="form.email"
              v-if="!isMessageEditor"
              class="user-input"
              :required="isMessageEditor ? false : true"
              name="email"
              type="email"
              placeholder="邮箱（必填）"
            />
            <input
              v-model="form.website"
              v-if="!isMessageEditor"
              class="user-input"
              name="url"
              type="url"
              placeholder="个人网站（完整域名，非必填）"
            />
          </section>
        </div>
      </transition-group>
    </section>
  </div>
</template>


<script>
import { debounce } from "throttle-debounce";
import Uitls from "@/services/utils/util";
import ClickOutside from "@/services/directives/click-outside";
import { getCursorPosition, setCursorPosition } from "@/services/utils/dom";
import gravatar from "@/services/gravatar/gravatar";
const emojiList = [
  "😃",
  "😂",
  "😅",
  "😉",
  "😌",
  "😔",
  "😓",
  "😘",
  "😡",
  "😭",
  "😱",
  "😳",
  "😵",
  "🌚",
  "👍",
  "👎",
  "💪",
  "🌹",
  "💊",
  "😡",
  "😠",
  "🍌",
  "🍍"
];
export default {
  created() {
    // 发送防抖
    this.debouncedSend = debounce(1000, true, () => {
      this.send();
    });
    if (process.client) {
      let user = window.localStorage.getItem("USER");
      if (user) {
        user = JSON.parse(user);
        this.form.nickname = user.nickname || "";
        this.form.email = user.email || "";
        this.form.website = user.website || "";
      }
    }
  },

  methods: {
    // 重置为空
    resetField() {
      this.form.content = ''
      this.contentText = ''
      this.contentHtml = ''
      this.$refs.editContent.innerHTML = ''
      this.$refs.editContent.innerText = ''
      this.cursorPosition = 0
    },
    
    send() {
      this.contentChange();
      const inValidMsg = this.getInValidMsg();
      if (inValidMsg) {
        alert(inValidMsg);
        return;
      }
      if (process.client) {
        const user = {
          nickname: this.form.nickname,
          email: this.form.email,
          website: this.form.website
        };
        window.localStorage.setItem("USER", JSON.stringify(user));
      }
      this.$emit("send", this.form);
    },

    getInValidMsg() {
      this.form.content = this.contentText;
      if (!this.isMessageEditor) {
        if (!this.form.email) {
          return "邮箱不能为空";
        }
        if (Uitls.validateEmail(this.form.email) === false) {
          return "请填写正确的email格式";
        }
      }
      if (this.form.website && Uitls.validateUrl(this.form.website) === false) {
        return "请填写正确的url格式";
      }
      if (!this.form.content || !this.form.content.replace(/\s/g, "")) {
        if (
          this.form.content.length > 1000 ||
          this.form.content.split("\n").length > 30
        ) {
          return `${
            this.isMessageEditor ? "留言" : "评论"
          }内容不能超过1000个字且控制在30行以内`;
        }
        return this.isMessageEditor ? "留言内容不能为空" : "评论内容不能为空";
      }
      // 留言墙
      if (this.isMessageEditor) {
        if (this.form.nickname && this.form.nickname.length > 32) {
          return "昵称不能超过32个字符";
        }
      } else {
        if (!this.form.nickname || this.form.nickname.length > 32) {
          return "昵称不能为空且长度不能超过32个字符";
        }
      }
      return false;
    },

    insertContent(type) {
      const contents = {
        image: {
          start: `![`,
          end: `]()`
        },
        link: {
          start: `[`,
          end: `]()`
        },
        code: {
          start: "\n```\n",
          end: "\n```"
        }
      };
      this.updateEditContent(contents[type]);
    },

    contentChange() {
      const html = this.$refs.editContent.innerHTML;
      const text = this.$refs.editContent.innerText;
      if (!Object.is(html, this.comemntContentHtml)) {
        this.contentHtml = html;
      }
      if (!Object.is(text, this.comemntContentText)) {
        this.contentText = text;
      }
      this.cursorPosition = getCursorPosition(this.$refs.editContent);
    },

    getCursorPosition() {
      this.cursorPosition = getCursorPosition(this.$refs.editContent);
    },

    insertEmoji(emoji) {
      const editor = this.$refs.editContent;
      const text = editor.innerText;
      // 插入 emoji
      editor.innerText =
        text.slice(0, this.cursorPosition) +
        `${emoji}` +
        text.slice(this.cursorPosition, text.length);
      // 光标位置后挪一位，以保证在刚插入的 emoji 后面
      setCursorPosition(editor, this.cursorPosition + 2);
      // 更新本地保存的光标位置变量（注意 emoji 占两个字节大小，所以要加1）
      this.cursorPosition = getCursorPosition(editor) + 2; // emoji 占两位
      this.contentChange();
    },

    updateEditContent({ start = "", end = "" }) {
      if (!start && !end) {
        return;
      }
      const editor = this.$refs.editContent;
      const selectedText = (
        window.getSelection || document.getSelection
      )().toString();
      const currentText = editor.innerText;
      if (selectedText) {
        const newText = currentText.replace(
          selectedText,
          start + selectedText + end
        );
        editor.innerText = newText;
      } else {
        editor.innerText = editor.innerText += start + end;
      }
    }
  },

  computed: {
    avatar() {
      return gravatar(this.form.email);
    }
  },

  props: {
    isShowReplyContent: {
      type: Boolean,
      default: false
    },

    isMessageEditor: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      contentText: "",
      contentHtml: "",
      isShowEmoji: false,
      emojiList,
      form: {
        nickname: "",
        content: "",
        email: "",
        website: ""
      },
      reply: {
        replyNickname: "",
        replyContent: ""
      }
    };
  },

  directives: {
    ClickOutside
  }
};
</script>


<style lang="scss">
@import "@/assets/scss/animation.scss";

.editor-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.slide-wrapper {
  position: relative;
}

.comment-wrapper {
  width: 100%;

  @media (max-width: 479px) {
    width: 100%;
  }

  .list-slide-item {
    transition: all 0.3s ease-in-out;
  }

  .reply-target {
    box-sizing: border-box;
    position: relative;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 4px;

    .icon-ant-close {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 5px;
      right: 5px;
      width: 30px;
      height: 30px;
      font-size: $font-size-extra-large;
      cursor: pointer;

      &:hover {
        color: var(--theme-active);
      }
    }
  }

  .editor {
    box-sizing: border-box;
    width: 100%;
    min-height: 6em;
    max-height: 30em;
    padding: 10px;
    font-size: 1rem;
    color: var(--font-color-article);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    outline: none;
    overflow-y: auto;
    transition: $theme-transition;
    font-family: Microsoft Yahei;

    &:empty:before {
      content: attr(placeholder);
    }

    &:hover {
      border-color: var(--font-color-light);
    }

    &:focus {
      border-color: var(--font-color-light);

      &:before {
        content: none;
      }
    }
  }

  .user-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;

    @media (max-width: 767px) {
      flex-direction: column;
    }

    .user-input {
      // box-sizing: border-box;
      width: calc(32% - 18px);
      height: 1em;
      line-height: normal; // 解决 placeholder 在 ios 无法垂直居中的问题
      padding: 8px 10px;
      outline: none;
      color: var(--font-color-article);
      white-space: nowrap;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background-color: var(--app-background-color);
      transition: $theme-transition;
      -webkit-appearance: none;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        border-color: var(--font-color-light);
      }

      &:focus {
        border-color: var(--font-color-light);
      }

      @media (max-width: 767px) {
        width: calc(100% - 20px);
        margin: 3px 5px;
      }
    }
  }

  .tools-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .tool-item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      cursor: pointer;
      transition: $theme-transition;

      &:hover {
        background-color: var(--tool-background-color);
      }
    }
  }

  .editor-tools {
    display: flex;
    justify-content: flex-start;
    transition: $theme-transition;
    margin: 5px 0;

    > a {
      position: relative;
      margin-right: 10px;

      &:last-child {
        margin-right: 0;
      }
    }
  }
  .emoji-wrapper {
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    position: absolute;
    top: 30px;
    left: 0;
    width: 200px;
    padding: 10px;
    background-color: var(--code-background);
    z-index: $index-normal;
    cursor: default;

    .emoji-item {
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      font-size: $font-size-extra-large;
      width: 36px;
      height: 36px;

      &:hover {
        background-color: var(--tool-background-color);
        cursor: pointer;
      }
    }
  }
}

.avatar {
  margin-right: 10px;
  display: inline-block;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #eee;

  @media (max-width: 479px) {
    display: none;
  }
}
</style>
