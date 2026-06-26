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

    // Dice logic
    const rollBtn = document.getElementById('roll-btn');
    const dice = document.getElementById('dice');
    const diceResult = document.getElementById('dice-result');
    
    let isRolling = false;

    if (rollBtn && dice && diceResult) {
        rollBtn.addEventListener('click', () => {
            if (isRolling) return;
            isRolling = true;
            
            diceResult.textContent = '두구두구두구...';
            
            const face = Math.floor(Math.random() * 6) + 1;
            
            const extraSpinsX = 1800;
            const extraSpinsY = 1800;
            
            let rotX = 0;
            let rotY = 0;
            
            let name = "";
            
            switch (face) {
                case 1: rotX = 0; rotY = 0; name = "혜윤"; break;
                case 2: rotX = 0; rotY = -90; name = "쪼"; break;
                case 3: rotX = 0; rotY = -180; name = "다현"; break;
                case 4: rotX = 0; rotY = 90; name = "보검"; break;
                case 5: rotX = -90; rotY = 0; name = "구찌"; break;
                case 6: rotX = 90; rotY = 0; name = "까미"; break;
            }
            
            rotX += extraSpinsX * (Math.random() > 0.5 ? 1 : -1);
            rotY += extraSpinsY * (Math.random() > 0.5 ? 1 : -1);
            
            dice.style.transform = `translateZ(-60px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            
            setTimeout(() => {
                diceResult.innerHTML = `🎉 오늘의 주인공은 <strong>${name}</strong>! 🎉`;
                isRolling = false;
            }, 1500);
        });
    }

    // Roulette logic
    const canvas = document.getElementById('roulette');
    const ctx = canvas ? canvas.getContext('2d') : null;
    const spinBtn = document.getElementById('spin-btn');
    const rouletteResult = document.getElementById('roulette-result');
    
    if (canvas && ctx && spinBtn && rouletteResult) {
        const options = ["한식", "중식", "일식", "양식", "퓨전", "아시아음식", "분식", "혜윤픽", "다현픽"];
        const colors = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff", "#fffffc"];
        const numOptions = options.length;
        const arcSize = (2 * Math.PI) / numOptions;
        let currentRotation = 0;
        let isSpinning = false;
        
        function drawRoulette() {
            for (let i = 0; i < numOptions; i++) {
                const angle = i * arcSize;
                ctx.beginPath();
                ctx.fillStyle = colors[i];
                ctx.moveTo(150, 150);
                ctx.arc(150, 150, 150, angle, angle + arcSize);
                ctx.fill();
                ctx.save();
                
                // Text
                ctx.fillStyle = "#333";
                ctx.font = "bold 16px 'Noto Sans KR'";
                ctx.translate(150 + Math.cos(angle + arcSize / 2) * 100, 150 + Math.sin(angle + arcSize / 2) * 100);
                ctx.rotate(angle + arcSize / 2 + Math.PI / 2);
                ctx.fillText(options[i], -ctx.measureText(options[i]).width / 2, 0);
                ctx.restore();
            }
        }
        
        drawRoulette();
        
        spinBtn.addEventListener('click', () => {
            if (isSpinning) return;
            isSpinning = true;
            rouletteResult.textContent = '빙글빙글...';
            
            const spins = Math.floor(Math.random() * 5) + 5;
            const randomDegree = Math.floor(Math.random() * 360);
            
            currentRotation += (spins * 360) + randomDegree;
            canvas.style.transform = `rotate(${currentRotation}deg)`;
            
            setTimeout(() => {
                const actualDeg = currentRotation % 360;
                const pointerDeg = (270 - actualDeg + 360) % 360;
                const selectedIndex = Math.floor(pointerDeg / (360 / numOptions));
                
                rouletteResult.innerHTML = `🎉 오늘의 메뉴는 <strong>${options[selectedIndex]}</strong>! 🎉`;
                isSpinning = false;
            }, 3000);
        });
    }
});
