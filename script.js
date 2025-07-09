document.addEventListener('DOMContentLoaded', () => {

    // 1. 搜索功能
    const searchInput = document.querySelector('.search-input');
    const toolItems = document.querySelectorAll('.tool-item');
    const categories = document.querySelectorAll('.category-container');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();

        toolItems.forEach(item => {
            const itemName = item.querySelector('span').textContent.toLowerCase();
            const itemVisible = itemName.includes(searchTerm);
            item.style.display = itemVisible ? 'flex' : 'none';
        });

        // 显示或隐藏整个分类
        categories.forEach(category => {
            const visibleItems = category.querySelectorAll('.tool-item[style*="display: flex"]');
            category.style.display = visibleItems.length > 0 ? 'block' : 'none';
        });
    });

    // 2. 返回顶部按钮
    const backToTopButton = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 3. 右侧快速导航
    const quickNavItems = document.querySelectorAll('.quick-nav .nav-item');
    const categoryTitles = document.querySelectorAll('.category-container .category-title h2');

    // 创建一个从导航文本到分类元素的映射
    const categoryMap = {};
    categoryTitles.forEach(title => {
        // 清理标题文本中的空格和换行符
        const cleanTitle = title.textContent.trim();
        categoryMap[cleanTitle] = title.closest('.category-container');
    });

    quickNavItems.forEach(navItem => {
        navItem.addEventListener('click', () => {
            const navText = navItem.querySelector('span').textContent.trim();
            const targetCategory = categoryMap[navText];
            
            if (targetCategory) {
                targetCategory.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 4. 滚动加载动画
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // 元素进入视口10%时触发
    });

    categories.forEach(category => {
        observer.observe(category);
    });

}); 