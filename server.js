const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS এনাবল করা যাতে আপনার মোবাইল অ্যাপ থেকে সহজে রিকোয়েস্ট পাঠানো যায়
app.use(cors());

// হোম রুট (টেস্ট করার জন্য)
app.get('/', (req, res) => {
    res.send('VidMate API Server is Running Successfully!');
});

// মেইন ডাউনলোড রুট
app.get('/download', async (req, res) => {
    let videoUrl = req.query.url; // অ্যাপ থেকে পাঠানো ইউটিউব লিংক

    if (!videoUrl) {
        return res.status(400).json({ error: 'দয়া করে একটি ইউটিউব লিংক দিন।' });
    }

    try {
        // যদি মোবাইলের শর্ট লিংক (youtu.be) হয়, সেটাকে মেইন লিংকে রূপান্তর করা
        if (videoUrl.includes('youtu.be/')) {
            const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
            videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        }

        // ইউটিউব লিংকটি সঠিক কিনা যাচাই করা
        if (!ytdl.validateURL(videoUrl)) {
            return res.status(400).json({ error: 'লিংকটি সঠিক নয়। আবার চেক করুন।' });
        }

        // ইউটিউব থেকে ভিডিওর সমস্ত ইনফরমেশন আনা
        const info = await ytdl.getInfo(videoUrl);
        
        // অডিও এবং ভিডিও দুটোই আছে এমন হাইয়েস্ট কোয়ালিটি mp4 ফরম্যাট ফিল্টার করা
        const format = ytdl.chooseFormat(info.formats, { 
            quality: 'highest', 
            filter: 'audioandvideo' 
        });

        if (!format) {
            return res.status(404).json({ error: 'কোনো ডাউনলোডেবল mp4 লিংক পাওয়া যায়নি।' });
        }

        // অ্যাপের জন্য রেসপন্স পাঠানো
        res.json({
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails[0].url,
            downloadUrl: format.url // এই লিংকটি দিয়ে অ্যাপে ভিডিও প্লে ও ডাউনলোড হবে
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'ভিডিওটি প্রসেস করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
