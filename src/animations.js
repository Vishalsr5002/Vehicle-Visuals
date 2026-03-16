export const animations = [
  {
    id: "clutch-system",
    system: "Clutch System",
    //image: "/images/spares.jpg",

    parts: [
      {
        id: "clutch-cylinder",
        part: "Clutch Cylinder1",
        //image: "/images/clutchh.webp",

        defects: [
          {
            id: "leaking-clutch-cylinder",
            name: "Leaking Clutch Cylinder",
            image: "/images/clutchh.webp",

            baseUrl:
              "https://dev.motovisuals.com/thirdpartyapi/#!/thirdPartyLogin",

            params: {
              subscriber_login_id: "motovisuals",
              subscriber_password: "motovisuals",
              api_key: "tg2zw99gwqb5",
              api_name: "animation_page",
              part_id: 7011,
              ro_number: "",
              is_interactive: 0,
              lang: "",
              brand: "",
              show_left_sidebar: 0,
              show_menu: 0,
              video_only: 0,
              show_menus: 0,
              auto_play: 0
            }
          }
        ]
      }
    ]
  },

  {
    id: "clutch-system2",
    system: "Clutch System 2",

    parts: [
      {
        id: "clutch-cylinder2",
        part: "Clutch Cylinder 2",
        //image: "/images/clutchh.webp",

        defects: [
          {
            id: "leaking-clutch-cylinder2",
            name: "Leaking Clutch Cylinder 2",
            image: "/images/clutchh.webp",

            baseUrl:
              "https://dev.motovisuals.com/thirdpartyapi/#!/thirdPartyLogin",

            params: {
              subscriber_login_id: "motovisuals",
              subscriber_password: "motovisuals",
              api_key: "tg2zw99gwqb5",
              api_name: "animation_page",
              part_id: 7011,
              ro_number: "",
              is_interactive: 1,
              lang: "",
              brand: "",
              show_left_sidebar: 0,
              show_menu: 0,
              video_only: 1,
              show_menus: 0,
              auto_play: 1
            }
          }
        ]
      }
    ]
  }
];