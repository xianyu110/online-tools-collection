document.addEventListener('DOMContentLoaded', () => {
    const toolsContainer = document.getElementById('tools-container');
    const sidebar = document.getElementById('sidebar');

    const categoryIconMap = {
        '便民查询': 'fa-city',
        '图片工具': 'fa-image',
        '格式转换': 'fa-file-export',
        '文字工具': 'fa-font',
        '计算测试': 'fa-calculator',
        '在线生成': 'fa-qrcode',
        '设计工具': 'fa-pencil-ruler',
        '开发工具': 'fa-code',
        '站长工具': 'fa-server',
        '默认': 'fa-toolbox'
    };

    const categoryColorMap = {
        '便民查询': 'text-green-500',
        '图片工具': 'text-pink-500',
        '格式转换': 'text-amber-500',
        '文字工具': 'text-indigo-500',
        '计算测试': 'text-emerald-500',
        '在线生成': 'text-fuchsia-500',
        '设计工具': 'text-purple-500',
        '开发工具': 'text-blue-500',
        '站长工具': 'text-gray-500',
        '默认': 'text-gray-400'
    };

    fetch('categorized-tools.json')
        .then(response => response.json())
        .then(categories => {
            if (!categories || categories.length === 0) {
                toolsContainer.innerHTML = '<p class="text-center text-red-500">无法加载工具数据。</p>';
                return;
            }

            sidebar.innerHTML = ''; // Clear sidebar
            toolsContainer.innerHTML = ''; // Clear main container

            categories.forEach(category => {
                const categoryId = `category-${category.category.replace(/\s+/g, '-')}`;
                const iconClass = categoryIconMap[category.category] || categoryIconMap['默认'];
                const colorClass = categoryColorMap[category.category] || categoryColorMap['默认'];

                // Populate sidebar
                const sidebarLink = document.createElement('a');
                sidebarLink.href = `#${categoryId}`;
                sidebarLink.innerHTML = `<i class="fas ${iconClass}"></i> ${category.category}`;
                sidebar.appendChild(sidebarLink);

                // Populate main content
                const categorySection = document.createElement('div');
                categorySection.className = 'category-section';
                categorySection.id = categoryId;

                let toolsHtml = '<div class="flex flex-wrap gap-4">';
                category.tools.forEach(tool => {
                    const label = tool.name || tool.text || '链接';
                    toolsHtml += `<div><a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="tool-link">${label}</a></div>`;
                });
                toolsHtml += '</div>';

                categorySection.innerHTML = `
                    <h2 class="category-title">
                        <i class="fas ${iconClass} ${colorClass}"></i>
                        ${category.category}
                    </h2>
                    ${toolsHtml}
                `;
                toolsContainer.appendChild(categorySection);
            });
        })
        .catch(error => {
            console.error('Error fetching or processing tool data:', error);
            toolsContainer.innerHTML = '<p class="text-center text-red-500">加载工具时出错。</p>';
        });
}); 