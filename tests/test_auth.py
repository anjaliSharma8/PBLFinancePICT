import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_registration_and_login(driver, base_url):
    wait = WebDriverWait(driver, 25)
    driver.get(f"{base_url}/login")
    
    # Registration Flow
    print(f"\n[AUTH] Testing User Registration on: {base_url}")
    
    # 1. Click the link to go to Register page
    register_link = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Create one now")))
    register_link.click()
    print("[AUTH] Navigated to Registration Page")
    
    timestamp = int(time.time())
    test_email = f"tester_{timestamp}@vault.com"
    test_password = "TestPass123!"
    
    # 2. Fill the Registration form
    wait.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Full Name']"))).send_keys("Automated Tester")
    driver.find_element(By.XPATH, "//input[@placeholder='Email Address']").send_keys(test_email)
    driver.find_element(By.XPATH, "//input[@placeholder='Password']").send_keys(test_password)
    
    # 3. Check the Terms & Conditions checkbox
    terms_checkbox = driver.find_element(By.CSS_SELECTOR, "input[type='checkbox']")
    driver.execute_script("arguments[0].click();", terms_checkbox)
    
    # 4. Click the Submit button
    submit_btn = driver.find_element(By.CLASS_NAME, "submit-btn")
    driver.execute_script("arguments[0].click();", submit_btn)
    
    # Wait for the alert and redirection back to login
    print("[AUTH] Registration submitted. Waiting for redirect...")
    time.sleep(3) 
    driver.get(f"{base_url}/login")
    
    # Login check
    print("[AUTH] Testing User Login...")
    driver.get(f"{base_url}/login")
    
    # Use 'type' attributes instead of IDs
    wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='email']"))).send_keys(test_email)
    driver.find_element(By.XPATH, "//input[@type='password']").send_keys(test_password)
    driver.find_element(By.CLASS_NAME, "submit-btn").click()
    
    wait.until(EC.url_contains("/dashboard"))
    assert "/dashboard" in driver.current_url
    print("✅ AUTHENTICATION MODULE: PASSED")