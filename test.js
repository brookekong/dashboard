let distributors = {};

// Wait for the document to be fully loaded
document.addEventListener("DOMContentLoaded", async () => {
    await fetchData(); // Load JSON data
    setupSidebar();    // Setup click listeners for the sidebar
    updateDashboard("Universal Pictures"); // Default chart loaded
});

// Fetch data from JSON file
async function fetchData() {
    try {
        const response = await fetch("data.json");
        distributors = await response.json();
    } catch (error) {
        console.error("Error loading distributor data:", error);
    }
}

// Dynamically populate the sidebar with studio names from the data
function setupSidebar() {
    const sidebarList = document.querySelector(".sidebar ul");
    sidebarList.innerHTML = ''; // Clear existing content

    // Dynamically add each studio to the sidebar
    Object.keys(distributors).forEach(studioName => {
        const listItem = document.createElement("li");
        listItem.textContent = studioName; // Set the studio name as the text
        sidebarList.appendChild(listItem); // Append it to the sidebar

        // Add event listener for each studio
        listItem.addEventListener("click", () => {
            // Remove active class from previously selected item and add to the new one
            document.querySelector(".sidebar .active")?.classList.remove("active");
            listItem.classList.add("active");

            updateDashboard(studioName); // Update charts for the selected studio
        });
    });
}

function updateDashboard(studioName) {
    const data = distributors[studioName];
    if (!data) return;

    // Update the values in the "highlights" section based on data from data.json
    document.getElementById("totalFilms").textContent = data.totalFilms || "N/A";  // Total 2023 Films
    document.getElementById("womenBTS").textContent = data.womenBTS || "N/A";  // Women in BTS Roles
    document.getElementById("underrepresentedBTS").textContent = data.underrepresentedBTS || "N/A"; // Underrepresented in BTS Roles
    document.getElementById("inclusionScore").textContent = data.inclusionScore || "N/A"; // Inclusion Score

    // Update the Gender Line Chart with Men and Women BTS data
    updateGenderLineChart(studioName, data);
}

// Update the Gender Line Chart with Men and Women BTS data dynamically
function updateGenderLineChart(studioName, data) {
    const genderLineChartCanvas = document.getElementById("genderLineChart");
    if (genderLineChartCanvas) {
        const genderLineChartCtx = genderLineChartCanvas.getContext("2d");

        // Clear the existing chart before rendering a new one
        if (window.genderLineChartInstance) {
            window.genderLineChartInstance.destroy();
        }

        window.genderLineChartInstance = new Chart(genderLineChartCtx, {
            type: "line",
            data: {
                labels: ["2019", "2020", "2021", "2022", "2023", "2024"],
                datasets: [
                    {
                        label: `${studioName} - Men BTS`,  // Men BTS data
                        borderColor: "#990000",
                        data: data.genderLineChart.menBTS, // Men BTS data
                        fill: false,
                    },
                    {
                        label: `${studioName} - Women BTS`,  // Women BTS data
                        borderColor: "#FFCC00",
                        data: data.genderLineChart.womenBTS, // Women BTS data
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
    }
}
