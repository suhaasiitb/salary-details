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
        // Look for employee matching by BB ID
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
  
    // Display general salary details (non-date data)
    let salaryHtml = `
      <h2>Salary Details for ${employeeData.Name}</h2>
      <table>
        <tr><th>Employee ID</th><td>${employeeData["BB ID"]}</td></tr>
        <tr><th>Mobile</th><td>${employeeData["contact no"]}</td></tr>
        <tr><th>Daily Total Weekly Earning</th><td>${employeeData["Daily Total Weekly Earning"]}</td></tr>
        <tr><th>Total Rental Charges</th><td>${employeeData["Total Rental Charges"]}</td></tr>
        <tr><th>Advance</th><td>${employeeData["Advance"]}</td></tr>
        <tr><th>Final Payment</th><td>${employeeData["Final Payment"]}</td></tr>
      </table>
    `;
  
    // Add the date-wise orders and pay data
    salaryHtml += "<h3>Date-wise Orders and Pay</h3><table>";
    salaryHtml += "<tr><th>Date</th><th>Orders</th><th>Pay</th></tr>";
  
    // Iterate over each date-based key in employeeData
    for (let date in employeeData) {
      // Check if the key matches a date pattern like "8-Jan-2025"
      if (date.match(/^\d{1,2}-\w{3}-\d{4}$/)) {
        const formattedDate = new Date(date).toLocaleDateString();
        const orderData = employeeData[date];
  
        // Check for the corresponding pay for this date, e.g., "8th Pay"
        const payField = `${parseInt(date.split('-')[0])}th Pay`; // Creates "8th Pay" from "8-Jan-2025"
        const payData = employeeData[payField] || "Not available"; // Default to "Not available" if pay data is missing
  
        salaryHtml += `
          <tr>
            <td>${formattedDate}</td>
            <td>${orderData}</td>
            <td>${payData}</td>
          </tr>
        `;
      }
    }
  
    salaryHtml += "</table>";
  
    // Insert the generated HTML into the page
    salaryDataDiv.innerHTML = salaryHtml;
  }
  