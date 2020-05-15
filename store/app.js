export const state = () => ({
    theme: "light"
})
export const mutations = {
    setTheme(state,theme) {
        document.body.id = theme
        window.localStorage.setItem('theme',theme)
        state.theme = theme
    }
}