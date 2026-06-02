/**
 * Navigation Manager - Quản lý điều hướng giữa các trang
 * Sử dụng cho hệ thống Phòng Đào tạo (PĐT)
 */

class NavigationManager {
    constructor() {
        this.routes = {
            'trang-chu': {
                path: '/frontend/pages/academic/pdt.html',
                title: 'Trang chủ Phòng đào tạo'
            },
            'sinh-vien': {
                path: '/frontend/pages/academic/pdt_sv.html',
                title: 'Sinh viên - PĐT'
            },
            'nganh-hoc': {
                path: '/frontend/pages/academic/pdt_nganhhoc.html',
                title: 'Ngành học - PĐT'
            },
            'mon-hoc': {
                path: '/frontend/pages/academic/pdt_monhoc.html',
                title: 'Môn học - PĐT'
            },
            'dang-ky-hoc-phan': {
                path: '/frontend/pages/academic/pdt_dkhp.html',
                title: 'Đăng ký học phần - PĐT'
            }
        };

        this.menuMapping = {
            'Trang chủ': 'trang-chu',
            'Sinh viên': 'sinh-vien',
            'Ngành học': 'nganh-hoc',
            'Môn học': 'mon-hoc',
            'Đăng ký học phần': 'dang-ky-hoc-phan'
        };

        this.init();
    }

    /**
     * Khởi tạo Navigation Manager
     */
    init() {
        this.attachEventListeners();
        this.setActiveMenu();
    }

    /**
     * Gắn sự kiện click cho các menu item
     */
    attachEventListeners() {
        const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');
        
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Lấy tên menu từ nội dung text
                const menuText = item.textContent.trim();
                
                // Kiểm tra nếu là menu hợp lệ
                if (this.menuMapping[menuText]) {
                    this.navigateTo(this.menuMapping[menuText]);
                }
            });
        });
    }

    /**
     * Điều hướng tới trang được chỉ định
     * @param {string} routeKey - Khóa tuyến đường
     */
    navigateTo(routeKey) {
        const route = this.routes[routeKey];
        
        if (!route) {
            console.error(`Tuyến đường '${routeKey}' không tồn tại`);
            return;
        }

        // Điều hướng tới trang mới
        window.location.href = route.path;
    }

    /**
     * Xác định trang hiện tại và đặt menu active
     */
    setActiveMenu() {
        const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');
        const currentPage = this.getCurrentPageRoute();

        menuItems.forEach(item => {
            const menuText = item.textContent.trim();
            const routeKey = this.menuMapping[menuText];

            // So sánh với trang hiện tại
            if (routeKey === currentPage) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    /**
     * Xác định tuyến đường của trang hiện tại
     * @returns {string} Khóa tuyến đường
     */
    getCurrentPageRoute() {
        const currentPath = window.location.pathname;
       
        // Kiểm tra chính xác theo tên file HTML thực tế của bạn
        if (currentPath.includes('pdt_sv.html')) {
          return 'sinh-vien';
        } else if (currentPath.includes('pdt_nganhhoc.html')) {
          return 'nganh-hoc';
        } else if (currentPath.includes('pdt_monhoc.html')) {
          return 'mon-hoc';
        } else if (currentPath.includes('pdt_dkhp.html')) {
          return 'dang-ky-hoc-phan';
        } else {
          return 'trang-chu';
        }
      }

    /**
     * Thêm tuyến đường mới (để mở rộng sau này)
     * @param {string} key - Khóa tuyến đường
     * @param {string} path - Đường dẫn tới file
     * @param {string} title - Tiêu đề trang
     * @param {string} menuName - Tên hiển thị trên menu
     */
    addRoute(key, path, title, menuName) {
        this.routes[key] = { path, title };
        if (menuName) {
            this.menuMapping[menuName] = key;
        }
    }
}

/**
 * Khởi tạo Navigation Manager khi DOM sẵn sàng
 */
document.addEventListener('DOMContentLoaded', () => {
    new NavigationManager();
});