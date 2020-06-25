#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.lskreno.cn' > CNAME

git init
git config user.name 'LSKReno'
git config user.email 'lisikuanreno@gmail.com'
git add -A
git commit -m '更新为 vuepress 博客'

# 如果发布到 https://lxchuan12.github.io
git push -f git@gitlab.com:LSKReno/lskreno_blog.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -
