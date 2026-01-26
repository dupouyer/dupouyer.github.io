#!/bin/bash
# 本地预览脚本 - 同步 PublishNote 文章后启动 Hexo 服务器

echo "🔄 Syncing articles from PublishNote..."
find PublishNote -name "*.md" -type f -exec cp {} source/_posts/ \;

COUNT=$(find PublishNote -name "*.md" | wc -l)
echo "✅ Synced $COUNT articles from PublishNote to source/_posts/"

echo ""
echo "🚀 Starting Hexo local server..."
echo "📝 Blog will be available at: http://localhost:4000"
echo ""
npm run server
