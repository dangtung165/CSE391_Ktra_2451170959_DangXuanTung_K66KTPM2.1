document.addEventListener('DOMContentLoaded', function() {
    // KHỞI TẠO BIẾN VÀ LẤY DOM ELEMENTS
    const addTaskForm = document.getElementById('addTaskForm');
    const closeFormBtn = document.getElementById('closeFormBtn');
    const openAddFormBtn = document.getElementById('openAddFormBtn');
    const submitTaskBtn = document.getElementById('submitTaskBtn');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.querySelector('.task-list');
    const priorityButtons = document.querySelectorAll('.priority-buttons .btn');

    let selectedPriority = 'High'; // Mặc định là High
    
    // Ẩn form thêm task lúc mới tải trang (tùy chọn, bạn có thể thiết lập trong CSS)
    addTaskForm.style.display = 'none'; 

    // LOGIC ĐÓNG/MỞ FORM THÊM TASK
    openAddFormBtn.addEventListener('click', () => {
        addTaskForm.style.display = 'block';
        taskInput.focus();
    });

    closeFormBtn.addEventListener('click', () => {
        addTaskForm.style.display = 'none';
    });

    // LOGIC CHỌN ĐỘ ƯU TIÊN (PRIORITY)
    priorityButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Lấy giá trị priority (High, Medium, Low)
            selectedPriority = this.innerText.trim();
            
            // Xóa hiệu ứng mờ (opacity) của các nút khác để highlight nút được chọn
            priorityButtons.forEach(b => b.style.opacity = '0.4');
            this.style.opacity = '1';
        });
    });

    // Khởi tạo hiển thị mặc định cho nút Priority
    priorityButtons.forEach(b => {
        if(b.innerText.trim() !== 'High') b.style.opacity = '0.4';
    });

    // LOGIC THÊM CÔNG VIỆC MỚI
    submitTaskBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const taskName = taskInput.value.trim();
        
        if(taskName === "") {
            alert("Vui lòng nhập tên công việc!");
            return;
        }

        // Xác định class và màu chữ dựa trên Priority
        let priorityTextColor = '';
        if (selectedPriority === 'High') priorityTextColor = 'text-danger';
        if (selectedPriority === 'Medium') priorityTextColor = 'text-warning';
        if (selectedPriority === 'Low') priorityTextColor = 'text-success';

        // Tạo cấu trúc HTML cho Task mới
        const taskHTML = `
            <li class="list-group-item task-item d-flex align-items-center justify-content-between">
                <div class="task-grid">
                    <div class="task-detail-col">
                        <span class="task-label">Task</span>
                        <p class="task-name">${taskName}</p>
                    </div>
                    <div class="task-detail-col priority-info ms-auto me-4 text-center">
                            <span class="task-label">Priority</span>
                            <p class="priority-text ${priorityTextColor}">${selectedPriority}</p>
                    </div>
                    <div class="task-detail-col me-4">
                        <span class="badge rounded-pill status-badge">To Do</span>
                    </div>
                </div>
                <div class="task-actions flex-shrink-0 ms-4">
                    <div class="status-check-col" style="cursor: pointer;">
                        <span class="custom-check check-empty"></span>
                    </div>
                    <a href="javascript:void(0)" class="edit-icon"><i class="fas fa-edit"></i></a>
                    <a href="javascript:void(0)" class="delete-icon"><i class="fas fa-trash"></i></a>
                </div>
            </li>
        `;

        // Thêm task vào danh sách
        taskList.insertAdjacentHTML('beforeend', taskHTML);

        // Reset form và đóng lại
        document.getElementById('taskForm').reset();
        addTaskForm.style.display = 'none';
        
        // Reset lại priority về mặc định
        selectedPriority = 'High';
        priorityButtons.forEach(b => {
            b.style.opacity = b.innerText.trim() === 'High' ? '1' : '0.4';
        });
    });

    // EVENT DELEGATION: XỬ LÝ XÓA, SỬA, VÀ ĐỔI TRẠNG THÁI
    taskList.addEventListener('click', function(e) {
        
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;

        // --- CHỨC NĂNG XÓA (DELETE) ---
        if (e.target.closest('.delete-icon')) {
            if(confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
                taskItem.remove();
            }
            return; // Dừng thực thi các logic khác
        }

        // --- CHỨC NĂNG SỬA (EDIT) ---
        if (e.target.closest('.edit-icon')) {
            const taskNameEl = taskItem.querySelector('.task-name');
            const newName = prompt('Chỉnh sửa tên công việc:', taskNameEl.innerText);
            if (newName !== null && newName.trim() !== '') {
                taskNameEl.innerText = newName.trim();
            }
            return;
        }

        // --- CHỨC NĂNG ĐỔI TRẠNG THÁI (STATUS) ---
        const checkCol = e.target.closest('.status-check-col');
        // Nếu click vào vùng vòng tròn trạng thái
        if (checkCol || e.target.classList.contains('custom-check')) {
            const checkCircle = taskItem.querySelector('.custom-check');
            const badge = taskItem.querySelector('.status-badge');

            // Chuyển đổi trạng thái theo vòng: To Do -> In Progress -> Done -> To Do
            if (checkCircle.classList.contains('check-empty')) {
                // To Do -> In Progress
                checkCircle.classList.remove('check-empty');
                checkCircle.classList.add('check-progress');
                badge.innerText = 'In Progress';
                
            } else if (checkCircle.classList.contains('check-progress')) {
                // In Progress -> Done
                checkCircle.classList.remove('check-progress');
                checkCircle.classList.add('check-done');
                badge.innerText = 'Done';
                
            } else if (checkCircle.classList.contains('check-done')) {
                // Done -> To Do
                checkCircle.classList.remove('check-done');
                checkCircle.classList.add('check-empty');
                badge.innerText = 'To Do';
            }
        }
    });
});