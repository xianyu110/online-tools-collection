# 在线工具大全

这是一个模仿 `guozhivip.com/tool/` 创建的在线工具导航网站。项目使用了现代化的前端技术栈，界面美观，易于扩展。

## 项目结构

- `index.html`: 网站主页面，包含了页面的基本 HTML 结构。
- `style.css`: 自定义样式文件，用于微调页面样式。
- `script.js`: JavaScript 文件，负责动态生成工具列表，使内容和结构分离。

## 技术栈

- **HTML5**
- **CSS3**
- **Tailwind CSS**: 一个功能类优先的 CSS 框架，用于快速构建现代化界面。
- **FontAwesome**: 提供丰富的图标库。
- **JavaScript (ES6+)**: 用于实现页面的动态逻辑。

## 如何预览

1.  直接在浏览器中打开 `index.html` 文件。
2.  为了获得更好的体验（例如，避免一些浏览器安全限制），推荐使用一个本地服务器来运行项目。可以进入 `online-tools-collection` 目录，然后运行以下命令：
    ```bash
    npx live-server
    ```

## 如何扩展

要添加新的工具或分类，只需编辑 `script.js` 文件中的 `toolCategories` 数组即可。

例如，要添加一个新的分类：

```javascript
{
    category: '新分类',
    subtitle: '新分类的描述',
    icon: 'fas fa-star', // FontAwesome 图标
    tools: [
        { name: '新工具1', url: '#' },
        { name: '新工具2', url: '#' },
    ]
}
```

## 下一步

- 完善所有工具分类和链接。
- 为每个工具链接创建实际的工具页面。
- 部署到静态网站托管服务。 