# 🏴‍☠️ One Piece 3D World Globe

An interactive 3D globe of the **One Piece** world, built with [Three.js](https://threejs.org/). Explore the Grand Line, Red Line, Four Blues, and 40+ canonical islands — all in your browser!

> Inspired by [The Library of Ohara](https://thelibraryofohara.com/one-piece-world-map/) interactive world map.

![One Piece Globe](https://img.shields.io/badge/One%20Piece-World%20Globe-gold?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7wn4+04oCN4pi g77iPPC90ZXh0Pjwvc3ZnPg==)

## ✨ Features

- 🌍 **Interactive 3D Globe** — Rotate, zoom, and pan like Google Earth
- 🔴 **Red Line** — The massive continental wall encircling the globe vertically
- 🟡 **Grand Line** — Golden equatorial route, the pirate's highway
- 🌊 **Calm Belt** — Windless danger zones flanking the Grand Line
- 🏝️ **40+ Islands** — Canonically positioned from Dawn Island to Laugh Tale
- 🔍 **Search** — Find any island instantly by name
- 📍 **Click to Explore** — Select an island for details (name, JP name, region, description)
- 🎥 **Camera Fly-to** — Smooth camera transitions to any location
- 🗺️ **Region Navigation** — Jump to East Blue, West Blue, North Blue, South Blue, Paradise, or New World
- ♻️ **Auto-rotate** — Toggleable globe rotation
- 📱 **Responsive** — Works on desktop and mobile

## 🗺️ World Geography

The globe faithfully recreates the One Piece world structure:

| Feature | Description |
|---------|-------------|
| **Red Line** | Vertical great circle continent dividing the world |
| **Grand Line** | Horizontal equatorial ocean route |
| **Calm Belt** | Two windless bands flanking the Grand Line |
| **East Blue** | Sea of Luffy's origin |
| **West Blue** | Sea of Robin's origin |
| **North Blue** | Sea of Law & Sanji's origin |
| **South Blue** | Sea of Ace's birth |
| **Paradise** | First half of the Grand Line |
| **New World** | Second half of the Grand Line |

## 🚀 Quick Start

### Option 1: Open directly
Simply open `index.html` in a modern browser. Due to ES module imports, you may need a local server.

### Option 2: Local server (recommended)

**Using Node.js:**
```bash
npx serve .
```

**Using Python:**
```bash
python -m http.server 3000
```

**Using PowerShell (no dependencies):**
```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Then open **http://localhost:3000** in your browser.

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| [Three.js](https://threejs.org/) r162 | 3D rendering engine |
| OrbitControls | Camera interaction (rotate/zoom/pan) |
| GLSL Shaders | Ocean waves, atmosphere glow |
| Vanilla HTML/CSS/JS | UI, no frameworks needed |
| Google Fonts | Pirata One + Inter typography |

## 📁 Project Structure

```
├── index.html      # Main HTML with UI overlays
├── style.css       # Dark ocean theme + glassmorphism design
├── app.js          # Three.js globe application (all 3D logic)
├── serve.ps1       # PowerShell dev server (optional)
├── LICENSE         # MIT License
└── README.md       # This file
```

## 🎨 Design

- **Dark Ocean Theme** — Deep navy gradients evoking the One Piece seas
- **Glassmorphism UI** — Frosted glass panels with blur effects
- **Pirate Typography** — "Pirata One" for headings
- **Micro-animations** — Pulsing markers, compass loading, smooth transitions
- **Color-coded Regions** — Each sea and route has its distinct color

## 🏝️ Included Locations

<details>
<summary>Click to see all 40+ islands</summary>

**Grand Line — Paradise:** Twin Cape, Whiskey Peak, Little Garden, Drum Island, Alabasta, Jaya, Skypiea, Long Ring Long Land, Water 7, Enies Lobby, Thriller Bark, Sabaody Archipelago, Impel Down, Marineford

**Grand Line — New World:** Punk Hazard, Dressrosa, Zou, Whole Cake Island, Wano Country, Egghead, Elbaf, Hachinosu, Lodestar Island, Laugh Tale

**East Blue:** Dawn Island, Shells Town, Orange Town, Baratie, Conomi Islands, Loguetown

**West Blue:** Ohara, Ilusia Kingdom

**North Blue:** Lvneel Kingdom, Flevance, Swallow Island, Minion Island, Germa Kingdom

**South Blue:** Briss Kingdom, Karate Island, Torino Kingdom, Centaurea, Baterilla

**Special:** Reverse Mountain, Mary Geoise, Fishman Island, Baltigo, God Valley, Kamabakka Kingdom

</details>

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-island`)
3. Commit your changes (`git commit -m 'Add new island'`)
4. Push to the branch (`git push origin feature/new-island`)
5. Open a Pull Request

### Ideas for contributions:
- Add more islands from the manga
- Add character location tracking
- Add Straw Hat route animation
- Improve island marker visuals
- Add sound effects
- Mobile touch gestures improvement

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This is a fan-made project. One Piece is created by **Eiichiro Oda** and published by **Shueisha**. All One Piece content, names, and locations are trademarks and copyrights of their respective owners. This project is not affiliated with or endorsed by the copyright holders.

## 🙏 Credits

- **[Eiichiro Oda](https://en.wikipedia.org/wiki/Eiichiro_Oda)** — Creator of One Piece
- **[The Library of Ohara](https://thelibraryofohara.com/)** — Reference for world map geography
- **[Three.js](https://threejs.org/)** — 3D rendering library
- **[Google Fonts](https://fonts.google.com/)** — Pirata One & Inter fonts
