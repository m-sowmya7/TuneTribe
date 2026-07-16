# TuneTribe 🎧

> Because who needs another music app? Apparently, we all do.

Welcome to **TuneTribe**—the web app that lets you search for songs, preview tracks, and bask in the glory of a slick UI, all powered by the Spotify API (via the magical Nocode API).  
Built with React and Vite, styled Tailwind CSS, powered by the unofficial JioSaavn API and deployed to Vercel faster than you can say "skip intro."

## 🚀 Live Demo

Try it, break it, love it: [https://tune-tribe.smyweb.xyz](https://tune-tribe.smyweb.xyz/)

## 📋 Features

- **Search for Tracks:** Type basically *anything* and get a list of related tracks, albums and artist's. (Yes, even “Baby Shark, Cocomelon” but don’t say we didn’t warn you.)
- **Mini Player:** Keep exploring while your music does its thing. Multitasking has never sounded this good.
- **Trending Tracks:** Find out what's hot before your "music expert" friend tells you about it.
- **Queue It Up:** – Throw your favorite songs into the queue and let autoplay do the heavy lifting. Congratulations, you're now a DJ with zero effort.
- **Completely Free:** No premium. No subscriptions. No "Pay to skip this song" nonsense.

## 🛠️ Tech Stack

- **Frontend:** React, Vite
- **Styling:** Tailwind CSS (custom-built, because copy-pasting components is too mainstream)
- **API:** Unofficial JioSaavn API
- **Deployment:** Vercel (because we like things easy)

## 🎤 Installation

Feeling adventurous? Run it locally.

```bash
git clone https://github.com/m-sowmya7/TuneTribe.git
cd tunetribe
npm install
npm run dev
```
> Open [http://localhost:5173](http://localhost:5173) in your browser.  
> If it doesn't work, did you try turning it off and on again?

### API Setup

1. Get yourself a songs api key (no, we can't give you ours).
2. Create a `.env` file and add:
    ```
    VITE_PUBLIC_API_URL=your_songs_api
    VITE_PUBLIC_BASE_URL=localhost_frontend_url (typically: http://localhost:5173)
    ```
3. Save, restart, and off you go.

## 🤝 Contributing

Want to contribute?  
Fork it. Clone it. Make it better.  
Open a pull request and prove you’re not a robot.

- Please keep it clean. If you break production, you’re buying the next round of debugging.
- All contributions are welcome, unless you’re planning to add autoplay for Rick Astley.

## 🙏 Credits & Disclaimers

- Powered by the JioSavan API, thanks to the some random developer. All music data belongs to their respective copyright overlords.
- UI inspired by “we want nice things, but also, not too many buttons.”
- No actual music is hosted here. Just previews. Please don’t sue us, JioSavan.

## 📬 Contact

Questions? Bugs? Fan mail?  
Open an [issue](https://github.com/your-username/tunetribe/issues) or just shout into the void.

---

> “Life is one grand, sweet song, so start the music.”  
> — Ronald Reagan (who probably never used Spotify)
