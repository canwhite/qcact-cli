#!/usr/bin/env node

//处理用户输入的命令
const program = require('commander');
//下载模板
const download = require('download-git-repo');
//问题交互
const inquirer = require('inquirer');
//node 文件模块
const fs = require('fs');
//填充信息到package.json
const handlebars = require('handlebars');
//动画效果
const ora = require('ora');
//字体加颜色
const chalk = require('chalk');
//显示提示图标
const symbols = require('log-symbols');

const child_process = require('child_process');

const shell = require('shelljs')


console.log(chalk.green('------','初始化开始','------'));



program.version('1.0.0','-V, --version')
.command('init <name>')
.action((name)=>{
    if(!fs.existsSync(name)){
        inquirer.prompt(//输入
            [
                {
                    name: 'description',
                    message: 'Input the object description'
                },
                {
                    name: 'author',
                    message: 'Input the object author'
                }
            ]
        ).then((answers)=>{
            const spinner = ora('Downloading...');
            spinner.start();

            child_process.exec('git clone https://github.com/canwhite/qcact', function(err, stdout, stderr) {
                if(err){
                    spinner.fail();
                    console.log(symbols.error,chalk.red(err));
                   
                }else{


                    spinner.succeed();
                    //console.log('---dir',__dirname,'--name',name);
                    shell.mv('./qcact', './' + name)

                    const filename = `${name}/package.json`;
                    const meta = {
                        name,
                        description: answers.description,
                        author: answers.author
                    }

                    if (fs.existsSync(filename)) {
                        const content = fs.readFileSync(filename).toString();
                        //转成json
                        let dt = JSON.parse(content);
                        dt.name = '{{name}}';
                        dt.description = '{{description}}'
                        //stringfy将JSON格式转化为json格式的字符串，parse相反
                        const result = handlebars.compile(JSON.stringify(dt, null, 2))(meta);
                        fs.writeFileSync(filename, result);
                        console.log(symbols.success, chalk.green('项目初始化完成'));
                    } else {
                        console.log(symbols.error, chalk.red('package不存在'))
                    }
                    console.log(symbols.success,chalk.green("the object has downloaded successfully!"))

                    //shell也可以起到操作cmd的作用,shell不像child_progress
                    //装下依赖
                    inquirer.prompt([
                        {
                          type: 'confirm',//类型confirm
                          name: 'ifInstall',
                          message: 'Are you want to install dependence now?',
                          default: true
                        }
                      ]).then((answers) => {
                        if (answers.ifInstall) {
                          inquirer.prompt([
                            {
                              type: 'list',//类型选择
                              name: 'installWay',
                              message: 'Choose the tool to install',
                              choices: [
                                'npm', 'yarn'
                              ]
                            }
                          ]).then(ans => {
                            if (ans.installWay === 'npm') {
                              let spinner = ora('Installing...');
                              spinner.start();
                              // 命令行操作安装依赖
                              shell.exec("cd " + name + " && npm i", function (err, stdout, stderr) {
                                if (err) {
                                  spinner.fail();
                                  console.log(symbols.error, chalk.red(err));
                                }
                                else {
                                  spinner.succeed();
                                  console.log(symbols.success, chalk.green('The object has installed dependence successfully!'));
                                }
                              });
                            } else {
                              let spinner = ora('Installing...');
                              spinner.start();
                              shell.exec("cd " + name + " && yarn install", function (err, stdout, stderr) {
                                if (err) {
                                  spinner.fail();
                                  console.log(symbols.error, chalk.red(err));
                                }
                                else {
                                  spinner.succeed();
                                  console.log(symbols.success, chalk.green('The object has installed dependence successfully!'));
                                }
                              })
                            }
                          })
                        } else {
                          console.log(symbols.success, chalk.green('You should install the dependence by yourself!'));
                        }
                      })
                    
                
            
            
                   
                }
            })


            /*

            download('https://github.com:canwhite/qcact#master',name,{ clone:true },(err)=>{
                if(err){
                    spinner.fail();
                    console.log(symbols.error,chalk.red(err));
                   
                }else{
                    spinner.succeed();
                    const fileName = `${name}/package.json`;
                    const meta = {
                        name,
                        description: answers.description,
                        author: answers.author
                    }
                    if (fs.existsSync(fileName)) {
                        const content = fs.readFileSync(fileName).toString();
                        const result = handlebars.compile(content)(meta);
                        fs.writeFileSync(fileName, result);
                    }
                    console.log(symbols.success,chalk.green("the object has downloaded successfully!"))

                }

            })
            */

        })

    }else{
        // 错误提示项目已存在，避免覆盖原有项目
        console.log(symbols.error, chalk.red('The object has exist'));


    }

})
program.parse(process.argv);

