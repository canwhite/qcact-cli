/*
cli的目的是：将项目模板放在 git 上，运行的时候再根据用户交互下载不同的模板，
经过模板引擎渲染出来，生成项目


--------------主要是下边四个工具，解析下载交互填充-----------------
commander.js，可以自动的解析命令和参数，用于处理用户输入的命令。
download-git-repo，下载并提取 git 仓库，用于下载项目模板。
Inquirer.js，通用的命令行用户界面集合，用于和用户进行交互。
handlebars.js，模板引擎，将用户提交的信息动态填充到文件中。
----------------美化工具----------------------
ora，下载过程久的话，可以用于显示下载中的动画效果。
chalk，可以给终端的字体加上颜色。
log-symbols，可以在终端上显示出 √ 或 × 等的图标。
*/

// #!/usr/bin/env node
// Shebang符号(#!) 用来来指定这个脚本的解释程序是who。
// 以上命令是在mac上系统path添加了node才能用，简单的话也可以which node 填写输出值
// windows不支持这个，windows是根据文件的拓展名来执行的




//pre：将index脚本映射为命令
/*
初始化脚本之后，接下来很重要的一点是把脚本映射为命令
具体操作就是在package.json文件中添加
"bin": {
    "qcact-cli": "./index.js"
},

然后的问题是怎么把脚本链接到全局
这里只用在当前项目目录下执行npm link就可以了
一般是在管理员权限下执行

有个问题是我如何在npm install之后直接npm link呢？
目前好像没有答案

也可以直接将下载搞好的包publish

通过 -g 进行全局安装，
就可以在自己本机上执行 qcact-cli init [name] 来初始化项目，这样便完成了一个简单的脚手架工具了。



*/











//1.使用commander处理命令行
const program = require('commander');

program.version('1.0.0','-V, --version')
.command('init <name>')
.action((name)=>{
    console.log(name);
})
program.parse(process.argv);



//2.download-git-repo 
//支持从 Github、Gitlab 和 Bitbucket 下载仓库，各自的具体用法可以参考官方文档。



//3.inquirer.js
//命令行交互功能可以在用户执行 init 命令后，
//向用户提出问题，接收用户的输入并作出相应的处理。
//以下示例
const inquirer  = require('inquirer');
inquirer.prompt(
    [
        {
            name: 'description',
            message: 'Input the object description'
        },
        {
            name: 'author',
            message: 'Input the object author'
        }
    ])
    .then((answers) => 
    {
        console.log(answers.author);
        console.log(answers.description)
    })



//4.handlebars渲染模板
//这里用handlebars的语法对模板中的package.json文件作一些修改
//注意是双引号包着双括号引入，
//并在下载模板完成之后将用户输入的答案渲染到 package.json 中

/*
{
    "name": "{{name}}",
    "version": "1.0.0",
    "description": "{{description}}",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "{{author}}",
    "license": "ISC"
}
*/




//5.视觉美化
//5-1.ora 
//用户输入答案之后，开始下载模板，这时候用ora来提示用户正在下载

const ora = require('ora');
//开始下载
const spinner = ora('正在下载模板...')
spinner.start();
/*
× 正在下载模板...
√ 正在下载模板...
*/
//下载失败调用
spinner.fail();

//下载成功调用
spinner.succeed();


//5-2.chalk来为打印信息加上样式

//5-3.log-symbols 在信息前面加上 √ 或 × 等的图标
const chalk = require('chalk');
const symbols = require('log-symbols');
console.log(symbols.success, chalk.green('项目创建成功'));
console.log(symbols.error, chalk.red('项目创建失败'));



//6.shelljs
//提供强大的命令行操作
/*
var shell = require('shelljs');
 
if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git');
  shell.exit(1);
}
 
// Copy files to release dir
shell.rm('-rf', 'out/Release');
shell.cp('-R', 'stuff/', 'out/Release');
 
// Replace macros in each .js file
shell.cd('lib');
shell.ls('*.js').forEach(function (file) {
  shell.sed('-i', 'BUILD_VERSION', 'v0.1.2', file);
  shell.sed('-i', /^.*REMOVE_THIS_LINE.*$/, '', file);
  shell.sed('-i', /.*REPLACE_LINE_WITH_MACRO.*\n/, shell.cat('macro.js'), file);
});
shell.cd('..');
 
// Run external tool synchronously
if (shell.exec('git commit -am "Auto-commit"').code !== 0) {
  shell.echo('Error: Git commit failed');
  shell.exit(1);
}
*/