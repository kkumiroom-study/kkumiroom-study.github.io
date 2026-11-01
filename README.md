# 꿈이룸 브이로그 스튜디오

Tools for the "every 2 days" personal-vlog videos of kumiroom.com (꿈이룸). The website itself lives on the `main` branch; this branch only holds the video tools, so nothing here is served on the site.

## What the owner wants (read every time)
- **Personal vlog, not an ad.** One real-feeling person narrates their own day in the first person ("새로운 목표가 생겨서 온라인 도서실에 와봤어요…"). No slogans, no "지금 가입하세요", no "연출된 예시" label. At most a small `kumiroom.com` at the very end.
- **Every video uses a different concept and shows different features.** Pick the next unused concept in `concepts.md`, then add it to the log at the bottom of that file.
- 9:16 vertical, 1080×1920, 24 fps, about 35–50 s. Handwritten-style captions (Gaegu font) that match the narration word timings. A small date sticker in the corner, little paper stickers for key moments.
- **Sound:** ElevenLabs narration (Korean, eleven_v4, a voice that fits the person; vary voices between videos). The campfire is crackles only: use `fire.py`. **Never** add noise beds that sound like wind or crinkly paper. The owner was very upset about this twice. Music is soft and low, under the voice (sidechain-ducked).
- **On screen:** only MY nickname is visible, never other people's names. No bottom-left joystick circle. Characters face the camera when it matters, so the camera goes on the tree side to show faces. Goals float above heads. Hide the top HUD counters, because the counts are fake in a local room.
- Do not change the website from this task. If you find a site bug, mention it in the report instead.

## Pipeline
1. `bash setup.sh <site checkout on main> /tmp/vlogwork` starts the broker on :8888 and the web server on :8767, fetches fonts, and renders music to `/tmp/vlogwork/music/*.wav`.
2. **Narration.** Write the script in natural spoken Korean, 8–10 short lines.
   1. `creative_list_voices` (languages ko) to pick a voice.
   2. `creative_generate_speech` (eleven_v4) once for the whole script, with blank lines between lines.
   3. Download the finished take with curl from its content_url.
   4. `creative_add_flow_asset_node` with the generation_id.
   5. `creative_transcribe_audio` (eleven_scribe_v1) to get per-word start/end. Those times drive the scene timeline. Start the voice at 1.0 s in the video.
3. **Scene.** Copy `examples/toeic/scene.js` and edit it. It runs inside the real page (same scope as the site code), so you can call site functions directly:
   - Walking: `walkTo3(x,z)`, `goSeat3(id)`. Or sit at once: `path3=[];pend3=id`.
   - Cafe: `startRun()`, then click `#mnPick [data-d="latte"]` when the menu card shows.
   - Lunch: `startLunch(min)` / `endLunch()`.
   - Tasks: `tasks` array, `goal`, `renderTicket()`. Study time: set `sess.start`/`sess.sec`.
   - Reactions: `me.burst={t:Date.now(),text:'👏',kind:'cheer'|'coffee'|'comfort'}`.
   - Mood: `moodOn()`.
   - Tree: `treeGrow(true)`. Cup: `myCup`/`myCupKind`.
   - Seats: `SEAT3D` map (id → {x,z,a,face,kind:'desk'|'cafe'|'lounge'|'window'}). `CAFE_PT()` gives the cafe point.
   - NPCs are rebuilt in `NPCS` with goals. `drawNpcGoals` is overridden to show only goal bubbles.
   - The camera is free in `window.__promoCam(cam,t)` with times in `window.__pt` seconds. Events go in `window.__promoEvents(T)` via `fire(sec,fn)`; captions and stickers in `window.__promoUI(T)`.

   Also check the site's own UI features you want to show (`grep` the main `index.html`): pomodoro, sound settings, rain/birds/white noise, friend invite link, window seats, lounge, home-screen install and so on.
4. `python3 build_page.py <site>/index.html scene.js /tmp/vlogwork/www`
5. Test frames: `DUR=44 TEST_TIMES=2,8,14,20,26,32,38 node rec.js /tmp/vlogwork/test test`. Then make a contact sheet with ffmpeg tile and **look at it**. Check:
   - no stray "undefined" labels
   - captions don't overlap the ticket
   - menus and toasts are visible
   - faces are visible
   - nobody blocks the lens

   Fix and repeat.
6. Full frames: `DUR=44 node rec.js /tmp/vlogwork/frames` takes about 6–7 min for 44 s. Run it in the background and never start a second recorder into the same folder.
7. Audio: `python3 fire.py fire.wav 60`, then mix like `examples/toeic/mix.sh`: voice + fire + low music, with café music only while at the café.
8. Encode: `ffmpeg -framerate 24 -i frames/f%04d.jpg -i mix.wav -c:v libx264 -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart out.mp4`
9. Make a final contact sheet, check it, and send the mp4 to the owner with a short Korean summary: concept, features shown, narration text.

Playwright: `require('playwright')`, chromium with `--use-angle=swiftshader --enable-unsafe-swiftshader`. The page uses virtual time (`window.__step(ms)`), so recording speed doesn't matter.
