import author from '../models/author'
import article from '../models/article'
export const state = () => ({
  authors: [],

  //作者详情
  author: {},
  articles: [],
  total: 0
})

export const mutations = {
  setAuthors(state, authors) {
    state.authors = authors
  },

  setArticles(state, {
    articles,
    total
  }) {
    state.articles = articles
    state.total = total
  },

  setAuthor(state, author) {
    state.author = author
  },

  setMoreArticles(state, { articles }) {
    state.articles = state.articles.concat(articles)
  }
}

export const actions = {
  async getAuthors({
    commit
  }) {
    try {
      const authors = await author.getAuthors()
      commit('setAuthors', authors)
    } catch (e) {
      console.log(e)
    }
  },

  async getArticles({
    commit
  }, params) {
    try {
      const {
        articles,
        total
      } = await article.getArticles(params)
      commit('setArticles', {
        articles,
        total
      })
    } catch (e) {
      console.log(e)
    }
  },

  async getAuthor({
    commit
  }, id) {
    try {
      const result = await author.getAuthorDetail(id)
      commit('setAuthor', result)
    } catch (e) {
      console.log(e)
    }
  },

  async getMoreArticles({commit}, params) {
     try{
      const { articles }  = await article.getArticles(params)
      commit('setMoreArticles',{ articles })
     } catch(e) {
       console.log(e)
     }
  }
}
