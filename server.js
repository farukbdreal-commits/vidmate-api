const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// ভিডিও লিস্ট
const videos = [
  {
    id: 1,
    title: "My First Video",
    category: "Music",
    thumbnail: "https://example.com/thumb1.jpg",
    videoUrl: "https://example.com/video1.mp4",
    downloadUrl: "https://example.com/video1.mp4"
  },
  {
    id: 2,
    title: "Nature Video",
    category: "Nature",
    thumbnail: "https://example.com/thumb2.jpg",
    videoUrl: "https://example.com/video2.mp4",
    downloadUrl: "https://example.com/video2.mp4"
  },
  {
    id: 3,
    title: "Technology Video",
    category: "Tech",
    thumbnail: "https://example.com/thumb3.jpg",
    videoUrl: "https://example.com/video3.mp4",
    downloadUrl: "https://example.com/video3.mp4"
  }
];


// API চালু আছে কিনা দেখার জন্য
app.get("/", (req, res) => {
  res.json({
    app: "Minitube API",
    status: "Running"
  });
});


// সব ভিডিও দেখাবে
app.get("/videos", (req, res) => {
  res.json(videos);
});


// একটি ভিডিও
app.get("/videos/:id", (req, res) => {

  const video = videos.find(
    v => v.id == req.params.id
  );

  if(!video){
    return res.status(404).json({
      message:"Video not found"
    });
  }

  res.json(video);

});


// ক্যাটাগরি অনুযায়ী ভিডিও
app.get("/category/:name", (req,res)=>{

  const result = videos.filter(
    v => v.category.toLowerCase() ==
    req.params.name.toLowerCase()
  );

  res.json(result);

});


// সার্চ
app.get("/search/:text",(req,res)=>{

  const result = videos.filter(
    v => v.title.toLowerCase()
    .includes(req.params.text.toLowerCase())
  );

  res.json(result);

});


// Server Start
const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
  console.log(
    "Minitube API running on port " + PORT
  );
})
