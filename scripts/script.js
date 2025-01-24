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
        const employeeData = data.find((employee) => employee["BB ID"] === parseInt(employeeId));
  
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
  
    // Start constructing the table
    let tableHTML = `
      <h2>Salary Details for ${employeeData.Name}</h2>
      <table>
        <tr><th>Employee ID</th><td>${employeeData["BB ID"]}</td></tr>
        <tr><th>Mobile</th><td>${employeeData["contact no"]}</td></tr>
        <tr><th>Total Weekly Earnings</th><td>${employeeData["Daily Total Weekly Earning"]}</td></tr>
        <tr><th>Total Rental Charges</th><td>${employeeData["Total Rental Charges"]}</td></tr>
        <tr><th>Advance Paid</th><td>${employeeData["Advance"]}</td></tr>
        <tr><th>Final Payment</th><td>${employeeData["Final Payment"]}</td></tr>
      </table>
      <h3>Date-wise Orders and Earnings</h3>
      <table>
        <tr><th>Date</th><th>Orders</th><th>Pay</th></tr>
    `;
  
    // Loop through the date-related keys in employeeData
    const dateKeys = Object.keys(employeeData).filter(key => key.includes("-"));
    dateKeys.forEach(date => {
      // Format the pay field key based on the date (e.g., "8th Pay" for "8-Jan-2025")
      const payKey = date.split("-")[0] + "th Pay"; // Convert "8-Jan-2025" to "8th Pay"
  
      // Add each date's orders and pay to the table
      tableHTML += `
        <tr>
          <td>${date}</td>
          <td>${employeeData[date]}</td>
          <td>${employeeData[payKey]}</td>
        </tr>
      `;
    });
  
    // Close the table and inject the HTML into the div
    tableHTML += `</table>`;
    salaryDataDiv.innerHTML = tableHTML;
  
    // Debugging: Check if content is being updated
    console.log("Displaying salary details:", employeeData);
  
    // Force reflow in Safari to ensure the page updates correctly
    salaryDataDiv.offsetHeight; // Accessing offsetHeight forces reflow
  }
  