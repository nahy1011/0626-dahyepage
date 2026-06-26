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

    renderSchedules();

    // Bible Verse logic
    const verseBtn = document.getElementById('verse-btn');
    const verseText = document.querySelector('.verse-text');
    const verseRef = document.querySelector('.verse-ref');
    
    const bibleVerses = [
        { text: "\"For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.\"", ref: "John 3:16" },
        { text: "\"I can do all this through him who gives me strength.\"", ref: "Philippians 4:13" },
        { text: "\"And we know that in all things God works for the good of those who love him, who have been called according to his purpose.\"", ref: "Romans 8:28" },
        { text: "\"Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.\"", ref: "Proverbs 3:5-6" },
        { text: "\"For I know the plans I have for you,\" declares the LORD, \"plans to prosper you and not to harm you, plans to give you hope and a future.\"", ref: "Jeremiah 29:11" },
        { text: "\"The LORD is my shepherd, I lack nothing.\"", ref: "Psalm 23:1" },
        { text: "\"In the beginning God created the heavens and the earth.\"", ref: "Genesis 1:1" },
        { text: "\"But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law.\"", ref: "Galatians 5:22-23" },
        { text: "\"Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.\"", ref: "Joshua 1:9" },
        { text: "\"Love is patient, love is kind. It does not envy, it does not boast, it is not proud.\"", ref: "1 Corinthians 13:4" },
        { text: "\"Do to others as you would have them do to you.\"", ref: "Luke 6:31" },
        { text: "\"Rejoice always, pray continually, give thanks in all circumstances; for this is God's will for you in Christ Jesus.\"", ref: "1 Thessalonians 5:16-18" },
        { text: "\"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.\"", ref: "Philippians 4:6" },
        { text: "\"Come to me, all you who are weary and burdened, and I will give you rest.\"", ref: "Matthew 11:28" },
        { text: "\"But seek first his kingdom and his righteousness, and all these things will be given to you as well.\"", ref: "Matthew 6:33" },
        { text: "\"Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!\"", ref: "2 Corinthians 5:17" },
        { text: "\"And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.\"", ref: "Philippians 4:7" },
        { text: "\"Let all that you do be done in love.\"", ref: "1 Corinthians 16:14" },
        { text: "\"For we walk by faith, not by sight.\"", ref: "2 Corinthians 5:7" },
        { text: "\"Your word is a lamp for my feet, a light on my path.\"", ref: "Psalm 119:105" },
        { text: "\"Cast all your anxiety on him because he cares for you.\"", ref: "1 Peter 5:7" },
        { text: "\"Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.\"", ref: "Ephesians 4:32" },
        { text: "\"The joy of the LORD is your strength.\"", ref: "Nehemiah 8:10" },
        { text: "\"A friend loves at all times, and a brother is born for a time of adversity.\"", ref: "Proverbs 17:17" },
        { text: "\"Let your light shine before others, that they may see your good deeds and glorify your Father in heaven.\"", ref: "Matthew 5:16" }
    ];

    if (verseBtn && verseText && verseRef) {
        verseBtn.addEventListener('click', () => {
            const randomIndex = Math.floor(Math.random() * bibleVerses.length);
            const selectedVerse = bibleVerses[randomIndex];
            
            verseText.style.opacity = 0;
            verseRef.style.opacity = 0;
            
            setTimeout(() => {
                verseText.textContent = selectedVerse.text;
                verseRef.textContent = "- " + selectedVerse.ref + " (NIV) -";
                
                verseText.style.transition = 'opacity 0.5s';
                verseRef.style.transition = 'opacity 0.5s';
                verseText.style.opacity = 1;
                verseRef.style.opacity = 1;
            }, 300);
        });
    }

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
