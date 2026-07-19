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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('VidMate Advanced API Server is Running!');
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

        // একদম লেটেস্ট ও সচল ফ্রিমিয়াম ইউটিউব ডাউনলোডার এপিআই গেটওয়ে
        const options = {
            method: 'GET',
            url: `https://youtube-downloader-download-youtube-videos.p.rapidapi.com/cd5490a2msh9b98dac4c88e5b4p12be3fjsnbf04135e80dc/v1/meta`,
            params: { id: videoId }
        };

        // যদি উপরের এপিআই কোনো কারণে রেসপন্স না করে, আমরা একটি রেডিমেড ডাইরেক্ট স্ক্র্যাপার মেথড ব্যবহার করছি
        const response = await axios.get(`https://api.decent-devs.com/yt/download?id=${videoId}`).catch(() => null);
        
        if (response && response.data && response.data.mp4) {
            return res.json({
                title: response.data.title || "YouTube Video",
                thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                downloadUrl: response.data.mp4
            });
        }

        // বিকল্প মেথড ২ (ব্যাকআপ হিসেবে যদি প্রথমটা ফেইল করে)
        const backupRes = await axios.get(`https://co.wuk.sh/api/json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: { url: `https://www.youtube.com/watch?v=${videoId}` }
        });

        if (backupRes.data && backupRes.data.url) {
            return res.json({
                title: "YouTube Video",
                thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                downloadUrl: backupRes.data.url
            });
        }

        res.status(404).json({ error: 'এই মুহূর্তে ভিডিওটি প্রসেস করা যাচ্ছে না। অন্য লিংক চেষ্টা করুন।' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'সার্ভার রেসপন্স করছে না বা লিংকটি ব্লকড। আবার চেষ্টা করুন।' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
