/*
 * @Author: ZRMYDYCG
 * @Date: 2025-05
 * @LastEditors: ZRMYDYCG
 * @LastEditTime: 2025-05
 * @Description: 信息提示插件
 */
import chalk from 'chalk'
import ora from 'ora'
import figlet from 'figlet'
import { formatDistanceToNow } from 'date-fns'


export function MonitoBuildInfoPlugin(options) {
  let spinner
  let startTime
  const processedFiles = [];

  return {
    name: 'monito-build-info',

    // 构建开始时触发
    buildStart() {
      startTime = new Date();
      
      // 输出炫酷ASCII标题
      console.log(chalk.cyan(figlet.textSync(options.sdkName, { font: 'Slant' })));
      console.log(chalk.gray(`v${options.sdkVersion} | 前端埋点与监控SDK构建工具\n`));

      // 启动加载提示
      spinner = ora({
        text: chalk.blue('🚀 开始构建监控SDK核心模块...'),
        color: 'blue',
        spinner: 'dots'
      }).start();
    },

    // 文件转换时触发（记录处理中的文件）
    transform(code, id) {
      if (id.includes('src/')) { // 只记录业务代码文件
        processedFiles.push(id.replace(process.cwd(), ''));
        spinner.text = chalk.blue(`🔧 正在处理: ${chalk.white(id.split('src/')[1])}`);
      }
      return null
    },

    // 所有输出生成后触发
    buildEnd(error) {
      if (error) {
        spinner.fail(chalk.red(`❌ 构建失败: ${error.message}`));
        return;
      }

      // 计算耗时
      const duration = formatDistanceToNow(startTime, { addSuffix: true });
      
      // 停止加载提示并输出总结
      spinner.succeed(chalk.green(`✅ 构建完成！总耗时: ${chalk.bold(duration)}`));
      
      console.log(`\n${chalk.yellow('📊 构建统计')}`);
      console.log(`  • 处理文件数: ${chalk.cyan(processedFiles.length)}`);
      console.log(`  • 核心模块: ${chalk.cyan('埋点规则引擎、监控采集器、数据上报模块')}`);
      console.log(`  • 输出目录: ${chalk.cyan('dist/')}`);
      console.log(`  • 构建时间: ${chalk.cyan(startTime.toLocaleString())}`);
    },

    // 所有bundle关闭后触发（可选扩展）
    closeBundle() {
      console.log(`\n${chalk.magenta('🎉 特别提示')}`);
      console.log(`  监控SDK已准备就绪！可通过以下方式验证：`);
      console.log(`  ${chalk.gray('1. 检查dist目录下的index.js是否包含埋点核心逻辑')}`);
      console.log(`  ${chalk.gray('2. 可以将期移动到某个前端项目的nodemodules下去测试')}\n`);
    }
  };
}