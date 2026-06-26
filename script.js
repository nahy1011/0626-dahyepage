// script.js
document.addEventListener('DOMContentLoaded', () => {
    // 2025년 8월 26일 설정
    const startDate = new Date('2025-08-26T00:00:00');
    
    function calculateDays() {
        const today = new Date();
        const timeDiff = today.getTime() - startDate.getTime();
        
        // 날짜 차이 계산 (밀리초 단위에서 일 단위로 변환)
        // 만난 첫 날을 1일로 계산하기 위해 +1
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
        
        // DOM 요소에 값 적용
        const daysCountElement = document.getElementById('days-count');
        if (daysCountElement) {
            // 숫자가 카운트업 되는 애니메이션 효과
            animateValue(daysCountElement, 0, daysDiff, 1500);
        }
    }

    // 숫자 카운트업 애니메이션 함수
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // easeOutQuart 애니메이션 효과
            const easeOutProgress = 1 - Math.pow(1 - progress, 4);
            obj.innerHTML = Math.floor(easeOutProgress * (end - start) + start);
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end;
            }
        };
        window.requestAnimationFrame(step);
    }

    calculateDays();

    // Schedule logic
    const scheduleForm = document.getElementById('schedule-form');
    const scheduleList = document.getElementById('schedule-list');
    
    let schedules = JSON.parse(localStorage.getItem('couple_schedules')) || [];

    function renderSchedules() {
        scheduleList.innerHTML = '';
        
        // Sort by date ascending
        schedules.sort((a, b) => new Date(a.date) - new Date(b.date));

        schedules.forEach((schedule, index) => {
            const li = document.createElement('li');
            
            const infoDiv = document.createElement('div');
            infoDiv.className = 'schedule-info';
            
            const dateText = document.createElement('span');
            dateText.className = 'schedule-date-text';
            dateText.textContent = schedule.date;
            
            const descText = document.createElement('span');
            descText.className = 'schedule-desc-text';
            descText.textContent = schedule.desc;
            
            infoDiv.appendChild(dateText);
            infoDiv.appendChild(descText);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => deleteSchedule(index);
            
            li.appendChild(infoDiv);
            li.appendChild(deleteBtn);
            
            scheduleList.appendChild(li);
        });
    }

    function addSchedule(e) {
        e.preventDefault();
        const dateInput = document.getElementById('schedule-date').value;
        const descInput = document.getElementById('schedule-desc').value;
        
        if (dateInput && descInput) {
            schedules.push({ date: dateInput, desc: descInput });
            localStorage.setItem('couple_schedules', JSON.stringify(schedules));
            
            // Reset form
            document.getElementById('schedule-desc').value = '';
            
            renderSchedules();
        }
    }

    function deleteSchedule(index) {
        schedules.splice(index, 1);
        localStorage.setItem('couple_schedules', JSON.stringify(schedules));
        renderSchedules();
    }

    if (scheduleForm) {
        scheduleForm.addEventListener('submit', addSchedule);
    }
    
    renderSchedules();
});
