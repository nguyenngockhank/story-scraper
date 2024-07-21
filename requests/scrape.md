## Scrape with Url

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
  "story": "chuong-giao-tong-mon-an-the",
  "splitPerFolder": 50,
  "fromChapter": 737,
  "toChapter": 5000
}
```