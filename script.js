document.addEventListener('DOMContentLoaded', () => {
    const toolsContainer = document.getElementById('tools-container');
    const quickNavContainer = document.getElementById('quick-nav-container');
    const searchInput = document.querySelector('.search-input');
    const backToTopButton = document.querySelector('.back-to-top');

    let allToolItems = [];
    let allCategories = [];

    // 动态加载和渲染工具
    async function loadTools() {
        try {
            const response = await fetch('tools.json');
            const categoriesData = await response.json();
            
            if (!categoriesData || categoriesData.length === 0) {
                toolsContainer.innerHTML = '<p>无法加载工具列表。</p>';
                return;
            }

            renderTools(categoriesData);
            setupEventListeners();

        } catch (error) {
            console.error('加载工具数据时出错:', error);
            toolsContainer.innerHTML = '<p>加载工具数据失败，请稍后重试。</p>';
        }
    }

    // 渲染工具列表和快速导航
    function renderTools(categoriesData) {
        let toolsHtml = '';
        let navHtml = '';

        categoriesData.forEach(category => {
            toolsHtml += `
                <div class="category-container">
                    <div class="category-title">
                        <i class="${category.icon}"></i>
                        <h2>${category.name}</h2>
                    </div>
                    <div class="tools-grid">
                        ${category.tools.map(tool => `
                            <a href="${tool.url}" target="_blank" class="tool-item">
                                <i class="${tool.icon}"></i>
                                <span>${tool.name}</span>
                            </a>
                        `).join('')}
                    </div>
                </div>
            `;
            navHtml += `
                <div class="nav-item" data-target="${category.name}">
                    <i class="${category.icon}"></i>
                    <span>${category.name}</span>
                </div>
            `;
        });

        toolsContainer.innerHTML = toolsHtml;
        quickNavContainer.innerHTML = navHtml;

        // 缓存 DOM 查询结果
        allToolItems = document.querySelectorAll('.tool-item');
        allCategories = document.querySelectorAll('.category-container');
    }

    // 设置所有事件监听器
    function setupEventListeners() {
        // 搜索功能
        searchInput.addEventListener('input', handleSearch);

        // 返回顶部
        window.addEventListener('scroll', handleScroll);
        backToTopButton.addEventListener('click', scrollToTop);

        // 快速导航
        const quickNavItems = document.querySelectorAll('.quick-nav .nav-item');
        quickNavItems.forEach(item => {
            item.addEventListener('click', () => handleQuickNav(item.dataset.target));
        });

        // 滚动加载动画
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        allCategories.forEach(category => {
            observer.observe(category);
        });
    }

    // 搜索处理函数
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();

        allToolItems.forEach(item => {
            const itemName = item.querySelector('span').textContent.toLowerCase();
            const itemVisible = itemName.includes(searchTerm);
            item.style.display = itemVisible ? 'flex' : 'none';
        });

        allCategories.forEach(category => {
            const visibleItems = category.querySelectorAll('.tool-item[style*="display: flex"]');
            category.style.display = visibleItems.length > 0 ? 'block' : 'none';
        });
    }

    // 滚动处理函数
    function handleScroll() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    }

    // 返回顶部处理函数
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 快速导航处理函数
    function handleQuickNav(targetCategoryName) {
        const targetCategory = Array.from(allCategories).find(category => {
            return category.querySelector('h2').textContent.trim() === targetCategoryName;
        });

        if (targetCategory) {
            targetCategory.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // 初始化
    loadTools();
}); 