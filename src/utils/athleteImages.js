// athleteImages.js

export const athleteImages = {
  // 🥇 Top Gold Medal Athletes
  "Michael Fred Phelps, II":
    "https://tse4.mm.bing.net/th/id/OIP.kADYKgu8fc9FzmQ9CXGzJQHaE7?rs=1&pid=ImgDetMain&o=7&rm=3",
  "Raymond Clarence \"Ray\" Ewry":
    "https://tse3.mm.bing.net/th/id/OIP.3BOM_BfimqiQx-rXgNU73QHaE7?rs=1&pid=ImgDetMain&o=7&rm=3",

  "Paavo Johannes Nurmi":
    "https://tse4.mm.bing.net/th/id/OIP.9HnwX7cwzMwqxs7vE3yATgHaDc?rs=1&pid=ImgDetMain&o=7&rm=3",

  "Frederick Carlton \"Carl\" Lewis":
    "https://tse3.mm.bing.net/th/id/OIP.xYaXyFWYezMnAqXEQ7HVawHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",

  "Mark Andrew Spitz":
    "https://alchetron.com/cdn/mark-spitz-8b68e422-373d-4145-957f-6e6ea5479e2-resize-750.jpeg",

  // 🥈 Top Silver Medal Athletes
  "Shirley Frances Babashoff":
    "https://tse4.mm.bing.net/th/id/OIP.RYKQdxnFqvica41nrTnpCwHaE7?rs=1&pid=ImgDetMain&o=7&rm=3",

  "Mikhail Yakovlevich Voronin":
    "https://d2a3o6pzho379u.cloudfront.net/29183.jpg",

  // ✅ Fixed Yang Yang (Short Track Speed Skater)
  "Yang Yang":
    "https://th.bing.com/th/id/OIP.9oWOCMHk28dcZZKaT7YGoAAAAA?w=246&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",

  "Aleksandr Nikolayevich Dityatin":
    "https://th.bing.com/th/id/OIP.nAM_I7NHI4PvhR4kYTdsewHaEK?w=310&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",

  "Dagmar Hase":
    "https://c8.alamy.com/comp/2NF2P33/german-swimmer-dagmar-hase-shows-off-the-silver-medal-she-won-in-the-womens-200m-backstroke-during-the-olympic-summer-games-in-barcelona-spain-july-31-1992-ap-photodenis-paquin-2NF2P33.jpg",

  // 🥉 Top Bronze Medal Athletes
  "Aleksey Yuryevich Nemov":
    "https://tse3.mm.bing.net/th/id/OIP.WwzO05Kyb58gGRvYS_VsLAHaE8?rs=1&pid=ImgDetMain&o=7&rm=3",

  "Franziska van Almsick":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Franziska_van_Almsick_-_2019_%28cropped%29.jpg/330px-Franziska_van_Almsick_-_2019_%28cropped%29.jpg",

  "Merlene Joyce Ottey-Page":
    "https://tse2.mm.bing.net/th/id/OIP.moon0xCT23KeXX215uEi8QHaGB?rs=1&pid=ImgDetMain&o=7&rm=3",

  "Harri Tapani Kirvesniemi":
    "https://i.ytimg.com/vi/j9QcfVevv84/maxresdefault.jpg",

  "Heikki Ilmari Savolainen":
    "https://th.bing.com/th/id/OIP.WQIVdQPemJfKJyr4z6sQ2QHaJ3?w=127&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
};

export const getAthleteImage = (name) => {
  return athleteImages[name] || "/images/fallback-card.png";
};