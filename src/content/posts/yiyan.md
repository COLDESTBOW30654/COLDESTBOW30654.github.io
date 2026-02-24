---
title: 一言
published: 2025-05-17 09:49:00
pinned: true
draft: false
category: 一些小玩意
---

# 每日一言

<p id="hitokoto">
  <a href="#" id="hitokoto_text">:D 获取中...</a>
</p>
<script>
  fetch('https://v1.hitokoto.cn')
    .then(response => response.json())
    .then(data => {
      const hitokoto = document.querySelector('#hitokoto_text')
      hitokoto.href = `https://hitokoto.cn/?uuid=${data.uuid}`
      hitokoto.innerText = data.hitokoto
    })
    .catch(console.error)
</script>

# 每日诗句

<span id="jinrishici-sentence">正在加载今日诗词....</span>
<script src="https://sdk.jinrishici.com/v2/browser/jinrishici.js" charset="utf-8"></script>