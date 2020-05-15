import author from '../models/author'

export const state = () => ({
  authors: [],

  //作者详情
  author: {}
})

export const mutations = {
  setAuthors(state, authors) {
    state.authors = authors
  },

  setAuthor(state, author) {
    state.author = author
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

  async getAuthor({
    commit
  }, id) {
    try {
      const result = await author.getAuthorDetail(id)
      commit('setAuthor', result)
    } catch (e) {
      console.log(e)
    }
  }
}
