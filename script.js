// Line Chart: Men and Women by Department Overtime
new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
        labels: ["2019", "2020", "2021", "2022", "2023", "2024"],
        datasets: [
            {
                label: "White",
                borderColor: "#aa0000",
                data: [80, 75, 70, 68, 65, 60],
                fill: false,
            },
            {
                label: "Underrepresented",
                borderColor: "#fdd835",
                data: [20, 25, 30, 32, 35, 40],
                fill: false,
            },
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: "bottom" }
        }
    }
});

// Bar Chart: Gender by Position
new Chart(document.getElementById("barChartGender"), {
    type: "bar",
    data: {
        labels: ["Director", "Writer", "Producer"],
        datasets: [
            {
                label: "Men",
                backgroundColor: "#990000",
                data: [75, 70, 65]
            },
            {
                label: "Women",
                backgroundColor: "#FFCC00",
                data: [25, 30, 35]
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: "bottom" }
        }
    }
});

// Donut Chart: Racial Inclusion Behind the Scenes
new Chart(document.getElementById("donutChart"), {
    type: "doughnut",
    data: {
        labels: ["White", "Underrepresented"],
        datasets: [{
            backgroundColor: ["#6a1b9a", "#ffca28"],
            data: [380, 46]
        }]
    },
    options: {
        cutout: "70%",
        plugins: {
            legend: {
                position: "bottom"
            }
        }
    }
});

// Bar Chart: Women by Department vs. Industry
new Chart(document.getElementById("barChartDept"), {
    type: "bar",
    data: {
        labels: ["2019", "2020", "2021", "2022", "2023", "2024"],
        datasets: [
            {
                label: "Universal",
                backgroundColor: "#DA4328",
                data: [40, 45, 50, 60, 55, 58]
            },
            {
                label: "Industry-Wide",
                backgroundColor: "#F08F23",
                data: [38, 42, 47, 50, 52, 53]
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: "bottom" }
        }
    }
});


//MODIFY SCRIPT.JS TO FETCH JSON DATA

let distributors = {};

document.addEventListener("DOMContentLoaded", async () => {
    await fetchData(); // Load JSON first
    setupSidebar();
    updateDashboard("Universal Pictures"); // Default
});

// Fetch JSON data
async function fetchData() {
    try {
        const response = await fetch("data.json");
        distributors = await response.json();
    } catch (error) {
        console.error("Error loading distributor data:", error);
    }
}

// Setup sidebar clicks
function setupSidebar() {
    document.querySelectorAll(".sidebar li").forEach((item) => {
        item.addEventListener("click", () => {
            document.querySelector(".sidebar .active")?.classList.remove("active");
            item.classList.add("active");
            updateDashboard(item.textContent.trim());
        });
    });
}

// Update dashboard dynamically
function updateDashboard(distributorName) {
    const data = distributors[distributorName];
    if (!data) return;

    document.querySelector(".card:nth-child(1) .value").textContent = data.totalFilms;
    document.querySelector(".card:nth-child(2) .value").textContent = data.womenBTS;
    document.querySelector(".card:nth-child(3) .value").textContent = data.underrepresentedBTS;
    document.querySelector(".card:nth-child(4) .value").textContent = data.inclusionScore;

    updateCharts(data);
}
