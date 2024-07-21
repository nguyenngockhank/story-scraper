## Scrape with Url

### metruyencv.com example
```
POST http://localhost:3000/api/story/scrape
content-type: application/json

{
  "url": "https://metruyencv.com/truyen/mot-van-loai-phuong-phap-thanh-tru-nguoi-choi",
  "metadata": {
    "storyId": "110001"
  }
}
```

### Truyenfull.com example
```
POST http://localhost:3000/api/story/scrape
content-type: application/json

{
  "url": "https://truyenfull.com/nguyen-lai-ta-la-tu-tien-dai-lao-f1.32797/",
  "metadata": {
    "storySlug": "nguyen-lai-ta-la-tu-tien-dai-lao"
  }
}
```

## Make audio

```
POST http://localhost:3000/api/transformer/story-to-mp3
content-type: application/json

{
  "story": "nguyen-lai-ta-la-tu-tien-dai-lao-f1.32797",
  "splitPerFolder": 50,
  "fromChapter": 1,
  "toChapter": 5000
}
```metruyen