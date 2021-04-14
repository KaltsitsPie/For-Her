## 宝贝们记得去看wiki！！！

### 开发注意事项

#### 代码规范

- 类名大驼峰属性名小驼峰
- 注释说明代码完成的工作，而非阐述代码工作流程

- 不必要的注释删掉



#### 工作流说明

1. 开始工作前，请务必在GitHub上新建远程分支，分支用`工作内容-你名字的缩写`命名

2. 使用`git pull`拉取最新远程仓库

3. 在本地创建同名分支，比如创建远程origin的dev分支到本地并切换到dev分支，可以用这个命令创建本地dev分支并将两者关联简化后续命令：

   ```
   $ git checkout -b dev origin/dev
   ```

4. 开发结束后，使用`git add 文件名`与`git commit -m "commit信息写在这里"`上传更改到本地，commit信息因为我们人也不多就随便写写吧中英文都可以，写清楚就ok。

   建议用这样的方式书写commit信息：

   ```
   第一行：大致写一下干了啥，比去创建了哪个文件，增加了哪个功能等等
   空一行
   第三行：稍微详细一点说明一下本次提交完成的工作
   ```

   这一步可以用微信开发者工具集成的版本管理来完成

   **特别注意！！**朋友们上传前一定逐个检查修改的地方，以免混入错误造成麻烦，呜呜呜。

   **特别注意x2！！**请务必少量多次进行commit，尽量一个文件或页面一个commit，否则很难在一个commit信息中说明白一堆更改都干了啥。

5. push到远端之前一定记得检查一下和当前远程master分支有没有冲突，具体做法：
   - `git switch master`转到本地master分支
   - `git pull`拉一下master上的更改，啥也没有的话切回去直接`git push`就可以了
   - 如果有更改，切回去执行`git merge master`把更改合并过来，没有冲突的话直接`git push`
   - 有冲突的话手动解决一下再push
6. 所有更改上传完成后点击`Pull Request`，长时间没合上去来找我，嘿嘿



#### Api说明

之后我会上传说明文档！么么

[可以看下这个（并没有必要）](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

