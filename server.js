const express = const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('VidMate Bypass API Server is Running!');
});

app.get('/download', async (req, res) => {
    let videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'দয়া করে একটি ইউটিউব লিংক দিন।' });
    }

    try {
        // ইউটিউব আইডি আলাদা করা
        let videoId = '';
        if (videoUrl.includes('youtu.be/')) {
            videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
        } else if (videoUrl.includes('v=')) {
            videoId = videoUrl.split('v=')[1].split('&')[0];
        } else {
            return res.status(400).json({ error: 'সঠিক ইউটিউব লিংক দিন।' });
        }

        // একটি পাবলিক ফ্রি মেথড দিয়ে সরাসরি mp4 লিংক জেনারেট করা (যা ব্লক হবে না)
        const response = await axios.get(`https://api.jony.com/api/yt.php?id=${videoId}`);
        const data = response.data;

        if (!data || !data.result) {
            return res.status(404).json({ error: 'ভিডিও প্রসেস করা যাচ্ছে না, অন্য লিংক ট্রাই করুন।' });
        }

        res.json({
            title: data.result.title || "YouTube Video",
            thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            downloadUrl: data.result.mp4 // সরাসরি কাজ করার মতো mp4 লিংক
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'সার্ভার রেসপন্স করছে না। আবার চেষ্টা করুন।' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));Url
