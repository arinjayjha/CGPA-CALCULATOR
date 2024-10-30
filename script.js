let semesterCount = 1;
let gpaData = [];

function showSemesterWise() {
    document.getElementById('cgpaForm').style.display = 'block';
    document.getElementById('instantCgpaForm').style.display = 'none';
    document.getElementById('result').innerHTML = '';
    document.getElementById('chartContainer').style.display = 'none';
}

function showInstantCgpa() {
    document.getElementById('instantCgpaForm').style.display = 'block';
    document.getElementById('cgpaForm').style.display = 'none';
    document.getElementById('result').innerHTML = '';
    document.getElementById('chartContainer').style.display = 'none';
}

function addSemester() {
    if (semesterCount >= 8) {
        alert("You can only add up to 8 semesters.");
        return;
    }

    semesterCount++;
    const semesterInputs = document.getElementById('semesterInputs');
    const newSemester = document.createElement('div');
    newSemester.className = 'semester';
    newSemester.innerHTML = `
        <label for="credits${semesterCount}">Credits for Semester ${semesterCount}:</label>
        <input type="number" id="credits${semesterCount}" max="50" required>
        <label for="gpa${semesterCount}">GPA for Semester ${semesterCount}:</label>
        <input type="number" id="gpa${semesterCount}" step="0.01" max="10" required>
    `;
    semesterInputs.appendChild(newSemester);
}

document.getElementById('cgpaForm').addEventListener('submit', function (e) {
    e.preventDefault();
    let totalCredits = 0;
    let totalPoints = 0;
    let valid = true;
    gpaData = []; // Reset GPA data for the graph

    for (let i = 1; i <= semesterCount; i++) {
        const credits = parseFloat(document.getElementById(`credits${i}`).value) || 0;
        const gpa = parseFloat(document.getElementById(`gpa${i}`).value) || 0;

        if (credits > 50 || gpa > 10) {
            valid = false;
            document.getElementById('result').innerHTML = `<div class="error">Credits must be ≤ 50 and GPA must be ≤ 10.</div>`;
            break;
        }

        totalCredits += credits;
        totalPoints += credits * gpa;
        const semesterCGPA = (totalPoints / totalCredits).toFixed(2);
        gpaData.push(semesterCGPA);
    }

    if (valid) {
        const cgpa = (totalPoints / totalCredits).toFixed(2);
        document.getElementById('result').innerText = `Your CGPA is: ${cgpa}`;
        drawChart();
    }
});

document.getElementById('instantCgpaForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const previousCgpa = parseFloat(document.getElementById('previousCgpa').value) || 0;
    const creditsCompleted = parseFloat(document.getElementById('creditsCompleted').value) || 0;
    const currentGpa = parseFloat(document.getElementById('currentGpa').value) || 0;
    const currentCredits = parseFloat(document.getElementById('currentCredits').value) || 0;

    if (previousCgpa > 10 || currentGpa > 10 || creditsCompleted > 300 || currentCredits > 50) {
        document.getElementById('result').innerHTML = `<div class="error">Ensure all values are within their limits.</div>`;
        return;
    }

    const totalPoints = (previousCgpa * creditsCompleted) + (currentGpa * currentCredits);
    const totalCredits = creditsCompleted + currentCredits;
    const instantCgpa = (totalPoints / totalCredits).toFixed(2);
    document.getElementById('result').innerText = `Your Instant CGPA is: ${instantCgpa}`;
    document.getElementById('chartContainer').style.display = 'none'; // Hide chart for instant CGPA
});

function drawChart() {
    const ctx = document.getElementById('cgpaChart').getContext('2d');
    const labels = Array.from({ length: semesterCount }, (_, i) => `Semester ${i + 1}`);
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'CGPA',
                data: gpaData,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    title: {
                        display: true,
                        text: 'CGPA'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Semesters'
                    }
                }
            }
        }
    });
    document.getElementById('chartContainer').style.display = 'block'; // Show chart after drawing
}
