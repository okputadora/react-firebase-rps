const boxShadow = "1px 1px 3px 1px #ddd"
export default {

  game: {
    container: {
      minHeight: 300,
      marginBottom: 30,
      boxShadow: boxShadow
    },

    weapons: {
      borderRadius: 4.5,
      boxShadow: "1px 2px 1px 2px #777",
      marginBottom: 20
    }
  },
  chat: {
    container: {
      boxShadow: boxShadow,
      height: 500,
      background: "white"
    },

    list: {
      overflowY: "auto",
      padding: 0
    },

    // is there a way to save the marginRight, padding, borderRadius, maxWidth
    // in an object and provide it to both messageIn and messageOut?
    messageOut: {
      marginRight: 10,
      padding: 10,
      borderRadius: 10,
      maxWidth: 200,
      listStyleType: "none",
      float: "right",
      background: "#2BE5FF"
    },

    messageIn: {
      marginLeft: 10,
      padding: 10,
      borderRadius: 10,
      maxWidth: 200,
      listStyleType: "none",
      float: "left",
      background: "#9AF867"
    }
  }
}
