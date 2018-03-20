const boxShadow = "1px 1px 3px 1px #ddd"
export default {

  game: {
    minHeight: 300,
    marginBottom: 30,
    boxShadow: boxShadow
  },

  chat: {
    container: {
      boxShadow: boxShadow,
      height: 500,
      background: "white"
    },

    list: {
      overflowY: "scroll",
      padding: 0
    }
  }
}
