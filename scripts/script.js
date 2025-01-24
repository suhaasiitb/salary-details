document.getElementById("employee-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission
  
    const employeeId = document.getElementById("employee-id").value.trim();
    if (!employeeId) {
      alert("Please enter a valid Employee ID.");
      return;
    }
  
    // Fetch the salary data
    fetch("data/salary-data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch salary data.");
        }
        return response.json();
      })
      .then((data) => {
        // Updated to match "BB ID" instead of "ID"
        const employeeData = data.find((employee) => employee["BB ID"] === employeeId);
  
        if (!employeeData) {
          alert("Employee ID not found. Please try again.");
          return;
        }
  
        // Display the salary details
        displaySalaryDetails(employeeData);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while fetching the salary details.");
      });
  });
  
  function displaySalaryDetails(employeeData) {
    const salaryDataDiv = document.getElementById("salary-data");
  
    salaryDataDiv.innerHTML = `
      <h2>Salary Details for ${employeeData.Name}</h2>
      <table>
        <tr><th>Employee ID</th><td>${employeeData["BB ID"]}</td></tr>
        <tr><th>Mobile</th><td>${employeeData.Mobile}</td></tr>
        <tr><th>Total Weekly Earnings</th><td>${employeeData["Total Weekly Earnings"]}</td></tr>
        <tr><th>Total Rental Charges</th><td>${employeeData["Total Rental Charges"]}</td></tr>
        <tr><th>Advance Paid</th><td>${employeeData["Advance Paid"]}</td></tr>
        <tr><th>Final Payment</th><td>${employeeData["Final Payment"]}</td></tr>
      </table>
    `;
  }
  