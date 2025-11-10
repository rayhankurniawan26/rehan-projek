document.addEventListener('DOMContentLoaded', () => {
    // 1. Dapatkan elemen-elemen penting
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('task-list');
    const searchInput = document.getElementById('searchInput'); 
    const datetimeDisplay = document.getElementById('datetime-display');

    // --- FUNGSI WAKTU DAN TANGGAL ---
    
    // Fungsi untuk mendapatkan string waktu saat ini (untuk data tugas) - TANPA DETIK
    function getCurrentTimestamp() {
        const now = new Date();
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        // Opsi waktu hanya jam dan menit
        const timeOptions = { 
            hour: '2-digit', 
            minute: '2-digit'
            // 'second' dihilangkan
        }; 
        
        const dateString = now.toLocaleDateString('id-ID', dateOptions);
        const timeString = now.toLocaleTimeString('id-ID', timeOptions);
        
        return `${dateString} | ${timeString}`;
    }

    // Fungsi untuk memperbarui tampilan jam real-time di atas - TANPA DETIK
    function updateClockDisplay() {
        const now = new Date();
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        // Opsi waktu hanya jam dan menit
        const timeOptions = { 
            hour: '2-digit', 
            minute: '2-digit'
            // 'second' dihilangkan
        };
        
        const dateString = now.toLocaleDateString('id-ID', dateOptions);
        const timeString = now.toLocaleTimeString('id-ID', timeOptions);
        
        if (datetimeDisplay) {
            datetimeDisplay.innerHTML = `${dateString} | ${timeString}`;
        }
    }

    updateClockDisplay();
    // Tetap perbarui setiap detik untuk memastikan menit berubah tepat waktu
    setInterval(updateClockDisplay, 1000); 

    // --- FUNGSI LOCAL STORAGE (TIDAK BERUBAH) ---

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(listItem => {
            const text = listItem.querySelector('.task-text').textContent.trim();
            const timestamp = listItem.querySelector('.task-timestamp').textContent.trim();
            tasks.push({ text: text, timestamp: timestamp });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        
        if (savedTasks) {
            const tasks = JSON.parse(savedTasks);
            
            tasks.forEach(task => {
                const newListItem = createTaskElement(task.text, task.timestamp);
                taskList.appendChild(newListItem);
            });
        }
    }

    // --- LOGIKA UTAMA APLIKASI (TIDAK BERUBAH) ---

    function createTaskElement(taskText, timestamp) {
        const listItem = document.createElement('li');
        
        listItem.innerHTML = `
            <div class="task-content">
                <span class="task-text">${taskText}</span>
                <small class="task-timestamp">${timestamp}</small>
            </div>
            <div class="actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Hapus</button>
            </div>
        `;

        const taskSpan = listItem.querySelector('.task-text');
        const editButton = listItem.querySelector('.edit-btn');
        const deleteButton = listItem.querySelector('.delete-btn');

        // LOGIKA EDIT DATA
        editButton.addEventListener('click', function() {
            if (editButton.textContent === 'Edit') {
                taskSpan.contentEditable = true;
                taskSpan.focus();
                editButton.textContent = 'Simpan';
                listItem.classList.add('editing');
            } else {
                taskSpan.contentEditable = false;
                editButton.textContent = 'Edit';
                listItem.classList.remove('editing');

                const newText = taskSpan.textContent.trim();
                taskSpan.textContent = newText;
                
                if (newText === '') {
                    listItem.remove();
                }
                
                saveTasks();
            }
        });

        // LOGIKA HAPUS DATA
        deleteButton.addEventListener('click', function() {
            listItem.remove(); 
            saveTasks();
        });

        return listItem;
    }

    // 2. Event listener untuk submit form (menambah tugas)
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const taskText = taskInput.value.trim();

        if (taskText !== "") {
            // Dapatkan waktu saat ini tanpa detik
            const timestamp = getCurrentTimestamp(); 
            const newListItem = createTaskElement(taskText, timestamp);
            
            taskList.appendChild(newListItem);
            taskInput.value = '';
            
            saveTasks();
        }
    });

    // 7. Event listener untuk fungsi pencarian
    searchInput.addEventListener('keyup', function() {
        const searchText = searchInput.value.toLowerCase();
        const tasks = taskList.querySelectorAll('li');

        tasks.forEach(task => {
            const taskName = task.querySelector('.task-text').textContent.toLowerCase();

            if (taskName.includes(searchText)) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        });
    });
    
    // Panggil loadTasks() saat halaman pertama kali dimuat
    loadTasks();
});