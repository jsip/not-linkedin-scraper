import json
from openpyxl import Workbook

keys = []
wb = Workbook()
ws = wb.active
ws.title = "Prospects"
ws.append(["Profile Name", "Profile Title", "Profile Url", "Company Name", "Company Url", "Time In Position", "Geo Location"])

dest_filename = input("Enter the filename: ").replace(".xlsx", "") + ".xlsx"

with open('prospects.json',encoding="utf8") as f:
    prospects = json.load(f)

    for prospect in prospects:
      ws.append([prospect["profileName"].split(",")[0], prospect["profileTitle"], prospect["profileUrl"], prospect["companyName"], prospect["companyUrl"], prospect["timeInPosition"], prospect["geoLocation"]])

wb.save(filename = dest_filename)