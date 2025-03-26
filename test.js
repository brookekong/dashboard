let distributors = {};

// Wait for the document to be fully loaded
document.addEventListener("DOMContentLoaded", async () => {
    await fetchData(); // Load JSON data
    setupSidebar();    // Populate sidebar after fetching data
    updateDashboard("Universal Pictures"); // Default chart loaded
});

// Fetch data from JSON file
async function fetchData() {
    try {
        const response = await fetch("data.json");
        distributors = await response.json();
        setupSidebar(); // Populate sidebar after data is loaded
    } catch (error) {
        console.error("Error loading distributor data:", error);
    }
}

// Dynamically populate the sidebar with studio names from the data
function setupSidebar() {
    const sidebarList = document.querySelector(".sidebar ul");
    sidebarList.innerHTML = ''; // Clear existing content

    if (!distributors || Object.keys(distributors).length === 0) {
        console.warn("No distributors data available.");
        return;
    }

    Object.keys(distributors).forEach(studioName => {
        const listItem = document.createElement("li");
        listItem.textContent = studioName;
        sidebarList.appendChild(listItem);

        // Highlight "Universal Pictures" as default
        if (studioName === "Universal Pictures") {
            listItem.classList.add("active");
        }

        // Add event listener for each studio
        listItem.addEventListener("click", () => {
            document.querySelector(".sidebar .active")?.classList.remove("active");
            listItem.classList.add("active");
            updateDashboard(studioName);
        });
    });
}


// Update dashboard with selected studio data
function updateDashboard(studioName) {
    const data = distributors[studioName];
    if (!data) return;

    document.getElementById("totalFilms").textContent = data.totalFilms || "N/A";
    document.getElementById("womenBTS").textContent = data.womenBTS || "N/A";
    document.getElementById("underrepresentedBTS").textContent = data.underrepresentedBTS || "N/A";
    document.getElementById("inclusionScore").textContent = data.inclusionScore || "N/A";

    // Ensure genderLineChart data exists before updating chart
    if (data.genderLineChart) {
        updateGenderLineChart(studioName, data);
    } else {
        console.warn(`No genderLineChart data available for ${studioName}`);
    }
}

let overtimeChart;

function updateGenderLineChart(studioName, data) {
    if (!data.overtimeChart) {
        console.error(`No overtimeChart data available for ${studioName}`);
        return;
    }

    const ctx = document.getElementById("overtimeChart").getContext("2d");
    
    if (overtimeChart) {
        overtimeChart.destroy(); // Destroy previous instance to avoid duplication
    }

    overtimeChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["2018", "2019", "2020", "2021", "2022", "2023"],
            datasets: [
                {
                    label: "White",
                    data: data.overtimeChart.white,
                    borderColor: "#990000",
                    backgroundColor: "rgba(153, 0, 0, 0.1)",
                    fill: true,
                },
                {
                    label: "Underrepresented",
                    data: data.overtimeChart.underrepresented,
                    borderColor: "#FFCC00",
                    backgroundColor: "rgba(255, 204, 0, 0.1)",
                    fill: true,
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Representation Over Time: ${studioName}`,
                    color: "#000000", // Title color black
                    font: {
                        family: "National 2",
                        weight: "normal", // Not bold
                        size: 16
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


let genderChart;

function updateGenderChart(studioName, data) {
    if (!data.genderLineChart) {
        console.error(`No genderLineChart data available for ${studioName}`);
        return;
    }

    const ctx = document.getElementById("genderChart").getContext("2d");

    if (genderChart) {
        genderChart.destroy(); // Destroy previous instance to avoid duplication
    }

    genderChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["2018", "2019", "2020", "2021", "2022", "2023"],
            datasets: [
                {
                    label: "Men BTS",
                    data: data.genderLineChart.menBTS,
                    backgroundColor: "#990000", // Dodger Blue
                    borderColor: "#990000",
                    borderWidth: 1
                },
                {
                    label: "Women BTS",
                    data: data.genderLineChart.womenBTS,
                    backgroundColor: "#FFCC00", // Hot Pink
                    borderColor: "#FFCC00",
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Gender Representation Over Time: ${studioName}`,
                    color: "#000000", // Black title
                    font: {
                        family: "National 2",
                        weight: "normal", // Not bold
                        size: 16
                    }
                },
                legend: {
                    labels: {
                        font: {
                            family: "National 2"
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    beginAtZero: true,
                    stacked: true
                }
            }
        }
    });
}


function updateDashboard(studioName) {
    const data = distributors[studioName];
    if (!data) return;

    document.getElementById("totalFilms").textContent = data.totalFilms || "N/A";
    document.getElementById("womenBTS").textContent = data.womenBTS || "N/A";
    document.getElementById("underrepresentedBTS").textContent = data.underrepresentedBTS || "N/A";
    document.getElementById("inclusionScore").textContent = data.inclusionScore || "N/A";

    if (data.overtimeChart) {
        updateGenderLineChart(studioName, data);
    } else {
        console.warn(`No overtimeChart data available for ${studioName}`);
    }

    if (data.genderLineChart) {
        updateGenderChart(studioName, data);
    } else {
        console.warn(`No genderLineChart data available for ${studioName}`);
    }
}



let racialPieChart;

function updateRacialPieChart(studioName, data) {
    if (!data.racialChart) {
        console.error(`No racialChart data available for ${studioName}`);
        return;
    }

    const ctx = document.getElementById("racialPieChart").getContext("2d");

    if (racialPieChart) {
        racialPieChart.destroy(); // Destroy previous chart instance
    }

    racialPieChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["White", "Underrepresented"],
            datasets: [
                {
                    data: data.racialChart,
                    backgroundColor: ["#990000", "#FFCC00"], // Red & Yellow
                    borderColor: "#FFFFFF",
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,  // Allow resizing
            plugins: {
                title: {
                    display: true,
                    text: `Racial Representation: ${studioName}`,
                    color: "#000000", // Black title
                    font: {
                        family: "National 2",
                        weight: "normal",
                        size: 16
                    }
                },
                legend: {
                    labels: {
                        font: {
                            family: "National 2"
                        }
                    }
                }
            }
        }
    });
}



let genderBarChart;

function updateGenderBarChart(studioName, data) {
    if (!data.genderChart) {
        console.error(`No genderChart data available for ${studioName}`);
        return;
    }

    const ctx = document.getElementById("genderBarChart").getContext("2d");

    if (genderBarChart) {
        genderBarChart.destroy(); // Destroy previous chart instance
    }

    genderBarChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["2018", "2019", "2020", "2021", "2022", "2023"],
            datasets: [
                {
                    label: "Gender Inclusion Score",
                    data: data.genderChart,
                    backgroundColor: "#990000", 
                    borderColor: "#990000",
                    borderWidth: 1
                }
            ]
        },
        options: {
            indexAxis: "y", // Horizontal bar chart
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Gender Inclusion Score Over Time: ${studioName}`,
                    color: "#000000", // Black title
                    font: {
                        family: "National 2",
                        weight: "normal",
                        size: 16
                    }
                },
                legend: {
                    display: false // No need for a legend in a single dataset
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
}


function updateDashboard(studioName) {
    const data = distributors[studioName];
    if (!data) return;

    document.getElementById("totalFilms").textContent = data.totalFilms || "N/A";
    document.getElementById("womenBTS").textContent = data.womenBTS || "N/A";
    document.getElementById("underrepresentedBTS").textContent = data.underrepresentedBTS || "N/A";
    document.getElementById("inclusionScore").textContent = data.inclusionScore || "N/A";

    if (data.overtimeChart) updateGenderLineChart(studioName, data);
    if (data.genderLineChart) updateGenderChart(studioName, data);
    if (data.racialChart) updateRacialPieChart(studioName, data);
    if (data.genderChart) updateGenderBarChart(studioName, data);
}
