# KiKi 大事报小程序 JSON 接口说明

本文档用于微信小程序调试 KiKi 大事报新闻数据接口。当前接口由 Astro 在构建时静态生成，部署在 Cloudflare Pages。

## 基础地址

```txt
https://kiki-events.pages.dev
```

如果后续绑定已备案自定义域名，小程序端可替换为新的基础地址。

## 微信小程序后台配置

在小程序后台配置：

```txt
开发 → 开发设置 → 服务器域名 → request 合法域名
```

添加：

```txt
https://kiki-events.pages.dev
```

注意：正式版小程序通常要求域名 HTTPS、证书有效，并可能要求 ICP 备案。开发者工具中可以临时勾选“不校验合法域名、web-view 域名、TLS 版本以及 HTTPS 证书”进行本地调试，但正式版不能依赖该选项。

## 接口列表

### 1. 站点信息

```txt
GET /api/site.json
```

用途：获取站点名称、描述、作者、最新文章 ID 和接口索引。

关键字段：

```json
{
  "name": "KiKi大事报",
  "description": "事件分析新闻稿档案，按事件、日期和类别索引。",
  "baseUrl": "https://kiki-events.pages.dev",
  "author": "KiKi喵",
  "latestEvent": "micron-marketcap-trillion",
  "endpoints": {
    "events": "/api/events.json",
    "categories": "/api/categories.json",
    "dates": "/api/dates.json",
    "eventDetailPattern": "/api/events/{id}.json"
  }
}
```

### 2. 新闻列表

```txt
GET /api/events.json
```

用途：小程序首页、列表页、搜索/筛选页。

返回结构：

```json
{
  "site": { "name": "KiKi大事报", "description": "...", "baseUrl": "https://kiki-events.pages.dev" },
  "generatedAt": "2026-05-27T00:00:00.000Z",
  "count": 3,
  "items": [
    {
      "id": "micron-marketcap-trillion",
      "title": "...",
      "deck": "...",
      "eventDate": "2026-05-27",
      "publishedAt": "2026-05-27T00:00:00.000Z",
      "updatedAt": null,
      "category": "科技",
      "tags": ["美光", "半导体"],
      "region": "美国",
      "severity": "中",
      "author": "KiKi喵",
      "cover": "/images/mascot-optimized/tech-hood-mask.webp",
      "coverAbsolute": "https://kiki-events.pages.dev/images/mascot-optimized/tech-hood-mask.webp",
      "coverAlt": "KiKi 科技兜帽口罩猫娘头像",
      "apiUrl": "/api/events/micron-marketcap-trillion.json",
      "apiUrlAbsolute": "https://kiki-events.pages.dev/api/events/micron-marketcap-trillion.json",
      "webUrl": "/events/micron-marketcap-trillion/",
      "webUrlAbsolute": "https://kiki-events.pages.dev/events/micron-marketcap-trillion/"
    }
  ]
}
```

### 3. 单篇新闻详情

```txt
GET /api/events/{id}.json
```

例如：

```txt
GET /api/events/micron-marketcap-trillion.json
```

用途：小程序文章详情页。

详情接口包含列表字段，并额外包含：

```json
{
  "sources": [
    {
      "title": "来源标题",
      "url": "https://example.com",
      "outlet": "媒体名"
    }
  ],
  "content": {
    "format": "html",
    "html": "<h2>事件概况</h2><p>正文...</p>"
  }
}
```

当前正文先提供 `content.format = html`，方便小程序用 `rich-text` 快速调试：

```xml
<rich-text nodes="{{article.content.html}}"></rich-text>
```

后续如果小程序可用、需要更好的原生体验，可升级为 blocks 结构：标题、段落、引用、列表分别渲染。

### 4. 类别索引

```txt
GET /api/categories.json
```

用途：类别页或筛选器。

返回：

```json
{
  "items": [
    {
      "name": "科技",
      "count": 2,
      "events": ["micron-marketcap-trillion", "xiaomi-2026-q1-results"]
    }
  ]
}
```

### 5. 日期索引

```txt
GET /api/dates.json
```

用途：日期归档页。

返回：

```json
{
  "items": [
    {
      "date": "2026-05-27",
      "count": 1,
      "events": ["micron-marketcap-trillion"]
    }
  ]
}
```

## 小程序请求示例

### 列表页

```js
const API_BASE = 'https://kiki-events.pages.dev'

Page({
  data: { events: [] },
  onLoad() {
    wx.request({
      url: `${API_BASE}/api/events.json`,
      method: 'GET',
      success: (res) => {
        this.setData({ events: res.data.items || [] })
      },
      fail: (err) => {
        console.error('获取新闻列表失败', err)
      },
    })
  },
})
```

### 详情页

```js
const API_BASE = 'https://kiki-events.pages.dev'

Page({
  data: { article: null },
  onLoad(options) {
    const id = options.id
    wx.request({
      url: `${API_BASE}/api/events/${id}.json`,
      method: 'GET',
      success: (res) => {
        this.setData({ article: res.data })
      },
      fail: (err) => {
        console.error('获取新闻详情失败', err)
      },
    })
  },
})
```

## 注意事项

1. 当前只导出 `draft: false` 的已发布稿件，草稿不会出现在接口中。
2. 图片字段同时提供相对路径和绝对路径，小程序建议优先使用 `coverAbsolute`。
3. 现在封面仍为 WebP；如果小程序端兼容性不好，可以后续新增 `/images/miniapp/*.jpg` 并把接口 cover 改成 JPG。
4. `generatedAt` 是构建时生成时间，不适合用于判断单篇文章发布时间；文章时间请使用 `publishedAt` / `eventDate`。
5. 如果最终小程序不可用或决定放弃，小程序接口相关文件可以整体删除，不影响网页主体功能。

## 清理接口时删除这些文件

如果 kiki主人之后说“小程序不可用，清掉接口”或类似意思，删除以下文件即可：

```txt
src/lib/miniapp-api.ts
src/pages/api/site.json.ts
src/pages/api/events.json.ts
src/pages/api/categories.json.ts
src/pages/api/dates.json.ts
src/pages/api/events/[slug].json.ts
scripts/validate-miniapp-api.mjs
docs/miniapp-api.md
```

然后运行：

```bash
npm run build
```

确认 `dist/api/` 不再生成后再部署。
