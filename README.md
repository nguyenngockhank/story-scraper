# readme


## Requirement

Node 14.x.x

```
sudo n
  copying : node/14.21.3
  installed : v14.21.3 (with npm 6.14.18)
```



## Running the app

```bash
# development
$ npm run start

# watch mode & see the api list
$ npm run dev

Access to see api list http://localhost:3000/api

# production mode
$ npm run start:prod

```

## Execute 

### SCRAPE STORY
```
curl -d "@./data/scrape-story.json" -H "Content-Type: application/json"  http://localhost:3000/api/story/scrape
```

### STORY TO MP3
```
curl -d "@./data/story-to-mp3.json" -H "Content-Type: application/json"  http://localhost:3000/api/transformer/story-to-mp3
```

### STORY TO EPUB
```
curl -d "@./data/story-to-epub.json" -H "Content-Type: application/json"  http://localhost:3000/api/transformer/story-to-epub
```

### EPUB TO STORY
```
curl -d "@./data/epub-to-story.json" -H "Content-Type: application/json"  http://localhost:3000/api/transformer/epub-to-story
```

### EPUB TO MP3
```
curl -d "@./data/epub-to-mp3.json" -H "Content-Type: application/json"  http://localhost:3000/api/transformer/epub-to-mp3
```

[READMORE](https://www.baeldung.com/curl-rest)

## Packages
- [View handerbar](https://github.com/pillarjs/hbs)



## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## After install 

Auto eslint
```
copy .vscode/settings.json
copy tsconfig.eslint.json
reload IDE
```


```bash
npm i nedb retry promisify axios cheerio 
```