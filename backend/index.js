// const express = require('express');
// const cors = require('cors');
// const { exec } = require('child_process');
// const path = require('path');
// const fs = require('fs');

// const app = express();
// const port = 5000;

// const YT_DLP_PATH = 'C:\\Tools\\yt-dlp\\yt-dlp.exe'; // Replace if needed
// const DOWNLOAD_DIR = path.join(__dirname, 'videos');

// app.use(cors());
// app.use(express.json());

// // Serve static video files
// app.use('/videos', express.static(DOWNLOAD_DIR));

// // Create download folder if not exists
// if (!fs.existsSync(DOWNLOAD_DIR)) {
//   fs.mkdirSync(DOWNLOAD_DIR);
// }

// // Route to download a video from YouTube
// app.post('/api/download', async (req, res) => {
//   const { url } = req.body;
//   if (!url) return res.status(400).json({ error: 'URL is required' });

//   const filename = `video_${Date.now()}.mp4`;
//   const outputPath = path.join(DOWNLOAD_DIR, filename);
//   const command = `"${YT_DLP_PATH}" -f best -o "${outputPath}" "${url}"`;

//   exec(command, (error, stdout, stderr) => {
//     if (error) {
//       console.error('Download error:', error);
//       return res.status(500).json({ error: 'Download failed' });
//     }
//     return res.json({ filename });
//   });
// });

// // Route to get the latest downloaded video
// app.get('/api/latest', (req, res) => {
//   fs.readdir(DOWNLOAD_DIR, (err, files) => {
//     if (err) return res.status(500).json({ error: 'Failed to read video directory' });

//     const mp4Files = files
//       .filter(file => file.endsWith('.mp4'))
//       .map(file => ({
//         name: file,
//         time: fs.statSync(path.join(DOWNLOAD_DIR, file)).ctime.getTime()
//       }))
//       .sort((a, b) => b.time - a.time);

//     if (mp4Files.length === 0) {
//       return res.status(404).json({ error: 'No videos found' });
//     }

//     return res.json({ filename: mp4Files[0].name });
//   });
// });

// app.listen(port, () => {
//   console.log(`✅ Server running on http://localhost:${port}`);
// });

const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

const YT_DLP_PATH = 'C:\\Tools\\yt-dlp\\yt-dlp.exe'; // Update path as needed
const DOWNLOAD_DIR = path.join(__dirname, 'videos');
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(FRONTEND_DIR));

// Serve static video files
app.use('/videos', express.static(DOWNLOAD_DIR));

// Create download folder if not exists
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR);
}

// Route to download a video from YouTube
app.post('/api/download', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const filename = `video_${Date.now()}.mp4`;
  const outputPath = path.join(DOWNLOAD_DIR, filename);
  const command = `"${YT_DLP_PATH}" -f best -o "${outputPath}" "${url}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Download error:', error);
      return res.status(500).json({ error: 'Download failed' });
    }
    return res.json({ filename });
  });
});

// Route to get the latest downloaded video
app.get('/api/latest', (req, res) => {
  fs.readdir(DOWNLOAD_DIR, (err, files) => {
    if (err) return res.status(500).json({ error: 'Failed to read video directory' });

    const mp4Files = files
      .filter(file => file.endsWith('.mp4'))
      .map(file => ({
        name: file,
        time: fs.statSync(path.join(DOWNLOAD_DIR, file)).ctime.getTime()
      }))
      .sort((a, b) => b.time - a.time);

    if (mp4Files.length === 0) {
      return res.status(404).json({ error: 'No videos found' });
    }

    return res.json({ filename: mp4Files[0].name });
  });
});

// Fallback to frontend/index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
