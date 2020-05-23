import article from '../models/article'
import comment from '../models/comment'
import Utils from '../services/utils/util'
import marked from '../plugins/marked'

export const state = () => ({
  // 文章列表
  articles: [],
  total: 0,
  starArticles: [],
  //归档
  archive: [],
  archiveTotal: 0,
  //详情
  article: null,
  comments: []
})
export const mutations = {
  setLikeComment(state, id) {
    state.comments.forEach(v => {
      if (v.id === id) {
        v.like ++
      }
    })
  },

  setMoreArticles(state, { articles }) {
    state.articles = state.articles.concat(articles)
  },

  setHomeArticles(state,{articles,starArticles,total}) {
      state.articles = articles
      state.starArticles = starArticles
      state.total = total
  },
  
  setComments(state, comments = []) {
    comments.forEach(v => {
      v.content = marked(v.content)
      if (v.parent_id !== 0) {
        const reply = comments.find(target => target.id === v.parent_id)
        if (reply) {
          v.replyName = reply.nickname
          v.replyContent = marked(reply.content)
        } else {
          v.replyName = ''
          v.replyContent = '该评论已被删除'
        }
      }
    })
    state.comments = comments
  },

  setArchive(state, { archive, total } ) {
      state.archive = archive
      state.archiveTotal = total
  },

  setArticleDetail(state,article) {
    state.article = article
  },

  setComments(state,comments = []) {
    comments.forEach(v => {
      v.content = marked(v.content)
      if (v.parent_id !== 0) {
        const reply = comments.find(target => target.id === v.parent_id)
        if (reply) {
          v.replyName = reply.nickname
          v.replyContent = marked(reply.content)
        } else {
          v.replyName = ''
          v.replyContent = '该评论已被删除'
        }
      }
    })
    state.comments = comments
  }
}
export const actions = {
  async likeCommentt({ commit}, id) {
    const res = await comment.likeComment(id)
    if (res.errorCode === 0) {
      commit('setLikeComment', id)
      return res
    }
  },
  
  //获取更多文章
  async getMoreArticles({ commit }, params) {
    try {
      const { articles, total } = await article.getArticles(params)
      commit('setMoreArticles', { articles, total })
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
    }
  },

  // 获取首页文章列表
  async getHomeArticles({commit},params) {
    try {
      const { articles,total } = await article.getArticles(params)
      const starArticles = await article.getStarArticles()
      //调用mutations中的方法
      commit('setHomeArticles',{articles,starArticles,total})
    } catch(e) {
      console.log(e)
    }
  },

  async getArchive({ commit }) {
    try {
      let res = await article.getArchive()
      res.forEach(v => {
        v.created_date = Utils.timestampToTime(v.created_date)
      })

      function format(month, day) {
        return month.toString().padStart(2, '0') + '.' + day.padStart(2, '0')
      }

      const total = res.length
      let archive = []
      // 按年份月份重新组合
      let curYear = ''
      let curMonth = 0
      let yearIndex = -1
      let monthIndex = 0
      res.forEach(v => {
        let dateArr = v.created_date.split('-')
        let year = dateArr[0]
        let month = parseInt(dateArr[1])
        let time = dateArr[2].split(' ')[0]
        if (year === curYear) {
          if (month === curMonth) {
            v.created_date = format(month, time)
            archive[yearIndex].monthList[monthIndex].articles.push(v)
          } else {
            v.created_date = format(month, time)
            archive[yearIndex].monthList.push({
              month,
              articles: [v]
            })
            monthIndex++
            curMonth = month
          }
        } else {
          v.created_date = format(month, time)
          archive.push({
            year,
            monthList: [{
              month,
              articles: [v]
            }]
          })
          yearIndex++
          monthIndex = 0
          curMonth = month
          curYear = year
        }
      })
      commit('setArchive', { archive, total })
    } catch(e) {
      console.log(e)
    }
  },

  async getArticleDetail({ commit }, params) {
     try {
       const result = await article.getArticleDetail(params)
       commit('setArticleDetail',result)
     } catch(e) {
       console.log(e)
     }
  },

  async getComments({commit}, params) {
    try {
      const comments = await article.getComments(params)
      commit('setComments', comments)
    } catch(e) {
      console.log(e)
    }
  },

  async likeArticle(_,id) {
     return  await article.likeArticle(id)
  },

  async getComments({ commit }, params) {
    try {
      const comments = await comment.getComments(params)
      commit('setComments', comments)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
    }
  },

  async createComment(_, params) {
    return await comment.createComment(params)
  },
}
