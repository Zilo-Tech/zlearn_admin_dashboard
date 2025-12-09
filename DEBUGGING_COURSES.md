# Debugging Guide: Course Creation Issues

## Issue 1: Can't Add Courses

### Possible Causes:
1. **Missing Required Fields** - Check if all required fields are filled
2. **Category Issues** - The category field might be causing problems
3. **API Validation Errors** - Backend might be rejecting the data

### Steps to Debug:

1. **Check Browser Console (F12)**
   - Look for red error messages
   - Check the Network tab for failed requests
   - Look at the response body for validation errors

2. **Try Creating a Minimal Course**
   - Title: "Test Course"
   - Description: "Test Description"
   - Leave everything else as default
   - Click Create

3. **Check Required Fields**
   Required fields for course creation:
   - Title (must not be empty)
   - Description (must not be empty)
   - Category (can be empty/null)
   - Level (has default: beginner)
   - Status (has default: draft)

---

## Issue 2: Can't Input Date

### Possible Causes:
1. **Browser Compatibility** - `datetime-local` input might not work in some browsers
2. **Date Format Issues** - The date format might be incorrect
3. **Field Disabled** - Some date fields are disabled based on conditions

### Solutions:

#### For Enrollment Deadline:
- The field should accept dates in format: `YYYY-MM-DDTHH:MM`
- Example: `2024-12-31T23:59`
- Make sure you're clicking in the date picker properly

#### For Discount Dates:
- These fields are **disabled** if:
  - `is_free` is checked (course is free)
  - `discount_price` is empty

To enable discount date fields:
1. Uncheck "Free Course"
2. Enter a price (e.g., 100)
3. Enter a discount price (e.g., 80)
4. Now the discount date fields should be enabled

---

## Quick Test Steps:

### Test 1: Create Minimal Course
```
Title: Test Course 123
Description: This is a test course
Category: (leave empty or select one)
Level: Beginner
Status: Draft
```
Click Create - this should work

### Test 2: Add Enrollment Deadline
```
After creating the course above, edit it and add:
Enrollment Deadline: Click the calendar icon and select a future date
```

### Test 3: Check Console Errors
1. Open browser console (F12)
2. Try to create a course
3. Look for errors in red
4. Share the error message

---

## Common Error Messages:

### "Category is required"
- Solution: Select a category from the dropdown OR leave it as "No Category"

### "Invalid date format"
- Solution: Use the date picker, don't type manually
- Format should be: YYYY-MM-DDTHH:MM

### "Enrollment deadline must be in the future"
- Solution: Select a date that's after today

### Network Error / 500 Internal Server Error
- Solution: Check backend logs
- The backend might have validation rules we need to fix

---

## If Nothing Works:

1. **Share the error message** from the browser console
2. **Share the network response** from the Network tab
3. **Try creating a Content Course** instead (from /admin/content/courses) to see if that works
