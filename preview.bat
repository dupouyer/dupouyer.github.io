@echo off
REM Windows 本地预览脚本 - 同步 PublishNote 文章后启动 Hexo 服务器

echo 🔄 Syncing articles from PublishNote...
for %%f in (PublishNote\*.md) do copy /Y "%%f" source\_posts\
echo ✅ Articles synced
echo.
echo 🚀 Starting Hexo local server...
echo 📝 Blog will be available at: http://localhost:4000
echo.
npm run server
