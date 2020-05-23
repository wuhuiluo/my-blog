<template>
  <div class="messages-container">
    <split-line :icon="'message'" :desc="'留言墙'"></split-line>
    <section class="editor-wrapper">
      <comment-editor @send="onSend" ref="editor" :isMessageEditor="true"></comment-editor>
    </section>
    <ul class="messages-wrapper markdown">
      <li class="message-item" v-for="message in messages" :key="message.id">
        <span v-if="message.nickname" class="nickname">@{{message.nickname}}</span>
        <div class="content">
          <no-ssr>
            <p v-html="marked(message.content)">
            </p>
          </no-ssr>
        </div>
        <time class="time" :datetime="message.createTime | filterTime">{{message.createTime | filterTime}}</time>
      </li>
    </ul>
    <div v-show="isLoadMore" class="load-more" @click="loadMore"></div>
    <empty v-if="!messages.length" :message="'还没有留言 /(ㄒoㄒ)/~~'" :isBack="false"></empty>
  </div>
</template>


<script>
import { mapState } from "vuex";
import markdown from "@/plugins/marked";
import CommentEditor from "@/components/base/comment-editor/comment-editor";
import SplitLine from "@/components/base/split-line/split-line";
export default {
  components: {
    SplitLine,
    CommentEditor
  },

  async fetch({ store, params }) {
    await store.dispatch('message/getMessages', {
      page: 0
    })
  },
  
  data() {
    return {
      page: 0
    };
  },
  
  head() {
    return {
      title: '留言区'
    }  
  },

  methods: {
    async onSend({ nickname, content }) {
      try {
        const res = await this.$store.dispatch("message/createMessage", {
          nickname,
          content
        });
        if (res && res.errorCode === 0) {
          this.$refs.editor.resetField();
          this.$store.dispatch("message/getMessages", {
            page: 0
          });
        }
        // console.log(res);
      } catch (e) {
        console.log(e);
      }
    },
    //markdown解析
    marked(content) {
      return markdown(content);
    },

    loadMore() {
      this.page++
      this.$store.dispatch('message/getMoreMessages', {
        page: this.page
      })
    },
  },
  
  computed: {
    isLoadMore() {
      if (this.messages.length) {
        return this.total > this.messages.length
      } else {
        return false
      }
    },

    ...mapState("message", ["messages"]),
    ...mapState("message", ["total"])
  },

  mounted() {
    console.log(this.messages);
    console.log(this.total);
  }
};
</script>


<style lang="scss">
.messages-container {
  @include container;

  .editor-wrapper {
    margin: 0.5em;
  }
}
.messages-wrapper {
  display: flex;
  flex-wrap: wrap;

  .message-item {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: .4em .5em;
    padding: 1em;
    background-color: var(--tag-color);
    transition: all .25s ease-in-out;

    @media (max-width: 479px) {
      margin: .2em .5em;
      padding: .5em;
    }

    &:hover {
      transform: translateY(-2px);
    }

    .nickname {
      height: 24px;
      font-size: $font-size-base;
      font-weight: $font-weight-bold;
    }

    .content {
      flex: 1;
      font-size: $font-size-base;
      padding: .5em 0;

      img {
        width: 50%;
      }
    }

    .time {
      margin-top: 1em;
      font-size: $font-size-base;
      text-align: right;
    }
  }
}
.load-more {
  box-sizing: border-box;
  width: 40px;
  height: 40px;
  margin: 10px auto 0;
  border: 8px solid #dcdfe7;
  border-radius: 50%;
  transition: all .25s ease-in-out;
  cursor: pointer;

  @media (max-width: 479px) {
    width: 30px;
    height: 30px;
    border-width: 5px;
  }

  &:hover {
    border-color: var(--theme-active);
    background-color: var(--theme-active);
    transform: scale(.65);
  }
}
</style>
