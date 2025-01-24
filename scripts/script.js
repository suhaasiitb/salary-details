import pandas as pd
import os

# Paths
data_file = "data/salary_data.xlsx"
output_dir = "pages"
url_file = "output_urls.txt"
base_url = "https://yourusername.github.io/salary-webpage/pages/"

# Load Excel file
df = pd.read_excel(data_file, sheet_name=0)

# Extract week dates (assume they are stored in the first row)
week_dates = df.iloc[0, 3:10].values  # Adjust index based on your column order
df = df.iloc[1:]  # Remove the first row with dates for processing employee data

# Create the output directory for pages
os.makedirs(output_dir, exist_ok=True)

# Generate an HTML file for each employee
urls = []
for _, row in df.iterrows():
    employee_id = row['ID']
    name = row['Name']
    mobile = row['Mobile']
    daily_orders = row.iloc[3:10].values  # 7 daily orders
    daily_pay = row.iloc[10:17].values  # 7 daily pays
    total_weekly_earnings = row['Total Weekly Earnings']
    rental_charges = row['Total Rental Charges']
    advance = row['Advance Paid']
    final_payment = row['Final Payment']

    # Create HTML content
    content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="../assets/styles.css">
        <title>{name}'s Salary Details</title>
    </head>
    <body>
        <h1>Salary Details for {name}</h1>
        <p><strong>ID:</strong> {employee_id}</p>
        <p><strong>Mobile:</strong> {mobile}</p>
        <table>
            <tr>
                <th>Date</th>
                <th>Orders Delivered</th>
                <th>Daily Pay</th>
            </tr>
    """

    # Add daily data
    for date, orders, pay in zip(week_dates, daily_orders, daily_pay):
        content += f"""
            <tr>
                <td>{date}</td>
                <td>{orders}</td>
                <td>{pay}</td>
            </tr>
        """

    # Add summary
    content += f"""
        </table>
        <h2>Summary</h2>
        <p><strong>Total Weekly Earnings:</strong> {total_weekly_earnings}</p>
        <p><strong>Total Rental Charges:</strong> {rental_charges}</p>
        <p><strong>Advance Paid:</strong> {advance}</p>
        <p><strong>Final Payment:</strong> {final_payment}</p>
    </body>
    </html>
    """

    # Write the HTML file
    file_path = f"{output_dir}/{employee_id}.html"
    with open(file_path, "w") as file:
        file.write(content)
    
    # Add the URL to the list
    urls.append(f"{base_url}{employee_id}.html")

# Generate the index.html file
index_content = "<h1>Employee Salary Details</h1><ul>"
for url, (_, row) in zip(urls, df.iterrows()):
    index_content += f'<li><a href="{url}">{row["Name"]}</a></li>'
index_content += "</ul>"

with open("index.html", "w") as file:
    file.write(index_content)

# Write the output URLs to a file
with open(url_file, "w") as file:
    file.writelines("\n".join(urls))

print("Pages generated successfully!")
