export const APIs = [
  {
    id: "display1",
    name: "Displaying Animation 1",
    image: "/spares.jpg",

    baseUrl: "https://motovisuals.com/thirdpartyapi/#!/thirdPartyLogin",

    params: {
      api_key: "tg2zw99gwqb5",
      api_name: "animation_page",
      part_id: 7011,
      is_interactive: 0,
      show_left_sidebar: 0,
      show_menu: 0,
      show_description: 0,
      video_only: 0,
      auto_play: 0
    }
  },

  {
    id: "display2",
    name: "Displaying Animation 2",
    image: "/spares.jpg",

    baseUrl: "https://motovisuals.com/thirdpartyapi/#!/thirdPartyLogin",

    params: {
      api_key: "tg2zw99gwqb5",
      api_name: "animation_page",
      part_id: 7011,
      is_interactive: 1,
      show_left_sidebar: 0,
      show_menu: 0,
      show_description: 0,
      video_only: 1,
      auto_play: 1
    }
  }
];