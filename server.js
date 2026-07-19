const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) {
        return res.status(400).json({ success: false, error: "অনুগ্রহ করে একটি URL দিন" });
    }

    try {
        const info = await ytdl.getInfo(videoUrl);
        
        // সর্বোচ্চ কোয়ালিটির .mp4 ফাইল ফিল্টার করা
        const format = ytdl.chooseFormat(info.formats, { 
            quality: 'highestvideo', 
            filter: format => format.container === 'mp4' && format.hasAudio && format.hasVideo
        });

        if (format && format.url) {
            res.json({
                success: true,
                title: info.videoDetails.title,
                downloadUrl: format.url
            });
        } else {
            res.status(444).json({ success: false, error: "কোনো সরাসরি MP4 ফাইল পাওয়া যায়নি।" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "লিঙ্কটি প্রসেস করতে সমস্যা হয়েছে।" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
