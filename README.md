# Rabbi Montrose Audio Archive

A static GitHub Pages website preserving Torah lecture recordings dated 2012–2015.

## Archive notes

- Source recordings remain unchanged on the original drive.
- Exact duplicate files were included once.
- The oversized AIFF recording was converted to a web-friendly AAC/M4A copy for browser playback and GitHub compatibility.
- Original date/time filenames are represented in normalized, URL-safe form.
- Web-ready audio files are stored as release assets under the `audio-archive` release so the repository remains lightweight.
- The mounted `montrose collection` folder contained 99 decodable audio files representing 70 unique SHA-256 hashes; 29 files were exact duplicate copies.
- The site includes all 70 unique recordings from that folder plus four previously published recordings from related archive folders.
- `data/montrose_manifest.csv` and `.json` retain source filenames, hashes, technical metadata, duplicate status, topics, summaries, and transcript paths.
- `data/audio_similarity_candidates.csv` records any near-duplicate candidates found by robust spectral comparison. No originals were deleted or altered.
- Transcripts are automated and are especially uncertain for Hebrew, Aramaic, Yiddish, names, and overlapping speech. Topic summaries are derived from those transcripts.
- Speaker attribution is inherited from the archive context and has not been independently verified for each dated recording.

## Local preview

Serve this folder with any static web server and open `index.html`.

## Named lectures added November 2026

- Vayera (13:39) and Chayei Sarah (10:00): original MP3 recordings, with editorial summaries and main points based on the recordings. Original recording dates are unconfirmed; filesystem modification dates are not treated as recording dates.
- Summaries paraphrase the speaker’s views; tentative interpretations remain identified as tentative.
