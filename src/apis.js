export const APIs = [
  {
    id: "display-dev",
    category: "displayAnimations",
    name: "Displaying Animations 1",
    image: "spares.jpg",
    url: "https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/7011?show_menu=0&is_interactive=1&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0",
    params: {
      Login: "motovisuals",
      Password: "motovisuals",
      show_menu: 0,
      is_interactive: 1,
      show_left_sidebar: 0,
      show_description: 0,
      video_only: 0,
      auto_play: 0
    }
  },
  {
    id: "display-prod",
    category: "displayAnimations",
    name: "Displaying Animations 2",
    image: "spares.jpg",
    url: "https://motovisuals.com/thirdpartyapi/#!/viewAnimation/7011?show_menu=0&is_interactive=0&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0",
    params: {
      Login: "motovisuals",
      Password: "motovisuals",  
      "Show menu": 0,
      is_interactive: 0,
      show_left_sidebar: 0,
      show_description: 0,
      video_only: 0,
      auto_play: 0
    }
  }
];