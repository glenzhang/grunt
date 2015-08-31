# Grunt工作流 #
1. 通常的工作流 编码 --> 调试 --> 上线
2. 加入Grunt后的工作流  ***启动Grunt*** --> 编码 --> 调试 --> 上线
3. Gurnt为非侵入式的，不影响当前工作流程

# 安装 #
1. 所以的操作都是在node平台上，需要安装[Node.js](http://www.nodejs.org/)
2. Grunt官方说明[Grunt.js](http://gruntjs.com/)，请运行npm install -g grunt-cli
3. sass编译环境依赖[ruby](https://www.ruby-lang.org/zh_cn/downloads/)和[gem](http://rubygems.org/pages/download)，安装后运行gem install sass
    > 鉴于国内的网络的情况，gem可能会无法运行，请替换gem source为大淘宝的镜像，命令`gem -r https://rubygems.org && gem -a http://ruby.taobao.org`

# 接入static目录 #
1. 添加pacekage.json, 增加相应的node modules
2. 添加Gruntfile.js, 添加需要的grunt命令

## 集成功能 ##
1. sass编译 - 需要模块grunt-contrib-sass
2. css sprite - 需要模块grunt-css-sprite
3. js压缩 - 需要模块grunt-contrib-uglify
4. **WILL ADD MORE**

##实例gruntdemo##

###目录分支为
    ├── static
        ├── gruntdemo/                
            ├── css/    
                ├── test_scss_nosprite.scss
                ├── test_scss_sprite.tosprite.scss   
                └── testcss.sprite.css 
            ├── images/    
                ├── slice/    
                    ├── a.png
                    ├── a@2x.png        
                    ├── b.png
                    └── b@2x.png
            └── js/
                └── base.js
        ├── package.json
        ├── Gruntfile.js
           

### 文件命名

* css文件
    * 需要sass编译的文件后缀名为**.scss**
    * 需要sprite合并的文件后缀名为**.sprite.css**
    * 同时需要sass编译和sprite合并的后缀名为**.tosprite.scss**
    * 其他后缀名为**.css**
* 图片
    * 高清图末尾需要"@2x", eg. a@2x.png
* js
    * 正常命名

### 开始grunt
1. 打开`pageage.json`,修改`client.root`为工作项目文件夹名字

        "client": {
            "root": "gruntdemo"
        }


2. 进入`Gruntfile.js`所在目录，然后`$ cd static`

3. sass编译`$ grunt sassc`, css文件夹的目录变为
        
        ├── static
            ├── gruntdemo/                
                ├── css/    
                    ├── test_scss_nosprite.scss
                    ├── test_scss_nosprite.sass.css
                    ├── test_scss_sprite.tosprite.scss
                    ├── test_scss_sprite.tosprite.sprite.sass.css    
                    └── testcss.sprite.css 
                ├── images/    
                    ├── slice/    
                        ├── a.png
                        ├── a@2x.png        
                        ├── b.png
                        └── b@2x.png
                └── js/
                    └── base.js
            ├── package.json
            ├── Gruntfile.js

    **编译后的文件会带有后缀名`.sass.css`, 表示为临时文件，方便使用删除命令**

4. css sprite，使用`$ grunt isprite`, 生成后目录为
            
        ├── static
            ├── gruntdemo/                
                ├── css/    
                    ├── test_scss_nosprite.scss
                    ├── test_scss_nosprite.sass.css
                    ├── test_scss_sprite.tosprite.scss
                    ├── test_scss_sprite.tosprite.sprite.sass.css  
                    ├── test_scss_sprite.tosprite.sprite.build.css    
                    ├── testcss.sprite.css
                    └── testcss.sprited.build.css 
                ├── images/    
                    ├── slice/    
                        ├── a.png
                        ├── a@2x.png        
                        ├── b.png
                        └── b@2x.png
                    ├── sprited/    
                        ├── test_scss_sprite.sprite.sass.png
                        ├── test_scss_sprite.sprite.sass@2x.png    
                        ├── testcss.sprite.png
                        └── testcss.sprite@2x.png
                └── js/
                    └── base.js
            ├── package.json
            ├── Gruntfile.js

    **生成后的文件会带有后缀名`.build.css`, 表示为临时文件，方便使用删除命令。同时此时生成的文件为最终文件，可以重命名。sprited为最终合成的图片所在的目录。**
    
    **建议： 如果开发完成将文件名中的build去除即可。**

5. 第3,4步可以合成一个，使用`$ grunt cssop`
6. 压缩js, 使用`$ grunt jsminify`
                
        └── js/
            ├── base.build.min.js
            └── base.js
    **建议： 如果开发完成将文件名中的build去除即可**   
    
7. 删除临时文件`$ grunt cleanup`, 会删除临时生成的文件。

8. 所有的目录都可以在`Gruntfile.js`修改。