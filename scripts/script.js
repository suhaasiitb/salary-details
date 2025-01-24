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
        console.log("Fetched data:", data); // Debug: View the fetched data
        const employeeData = data.find((employee) => employee["BB ID"] === parseInt(employeeId));
  
        if (!employeeData) {
          alert("Employee ID not found. Please try again.");
          return;
        }
  
        // Debug: Log the employee data for inspection
        console.log("Employee data found:", employeeData);
  
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
  
    // Display general salary details
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
  
    // Generate a table for date-wise data (orders and pay)
    salaryHtml += "<h3>Date-wise Orders and Pay</h3><table>";
    salaryHtml += "<tr><th>Date</th><th>Orders</th><th>Pay</th></tr>";
  
    // Iterate through the date-based data
    for (let date in employeeData) {
      if (date.includes("-")) {
        // Check if the key is a valid date-like field (like 8-Jan-2025)
        const orderData = employeeData[date];
        const payData = employeeData[`${date.split('-')[0]}th Pay`];
  
        // Debug: Log each date to check if it matches correctly
        console.log(`Processing date: ${date}, Orders: ${orderData}, Pay: ${payData}`);
  
        // Format the date to be more readable
        const formattedDate = new Date(date).toLocaleDateString();
        
        salaryHtml += `
          <tr>
            <td>${formattedDate}</td>
            <td>${orderData}</td>
            <td>${payData || 'N/A'}</td>
          </tr>
        `;
      }
    }
  
    salaryHtml += "</table>";
  
    // Insert the data into the page
    salaryDataDiv.innerHTML = salaryHtml;
  }
  